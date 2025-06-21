import { getPromisifiedDb } from '../database/init.js';

// Request logging middleware
export function logger(req, res, next) {
  const start = Date.now();

  // Get basic request info
  const requestInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    timestamp: new Date().toISOString(),
    referrer: req.headers['referer'] || null
  };

  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    res.end = originalEnd;
    res.end(chunk, encoding);

    const duration = Date.now() - start;
    const logData = {
      ...requestInfo,
      statusCode: res.statusCode,
      duration: duration,
      contentLength: res.get('content-length') || 0
    };

    // Log to console with colors based on status code
    logToConsole(logData);

    // Log to database if it's an API request (async, don't wait)
    if (req.originalUrl.startsWith('/api/')) {
      logToDatabase(logData, req.user || null, req.admin || null).catch(err => {
        console.error('Database logging error:', err);
      });
    }
  };

  next();
}

// Console logging with colors
function logToConsole(logData) {
  const { method, url, ip, statusCode, duration, timestamp } = logData;

  // Color codes
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m'
  };

  // Choose color based on status code
  let statusColor = colors.green;
  if (statusCode >= 400 && statusCode < 500) {
    statusColor = colors.yellow;
  } else if (statusCode >= 500) {
    statusColor = colors.red;
  }

  // Choose color based on response time
  let durationColor = colors.green;
  if (duration > 1000) {
    durationColor = colors.red;
  } else if (duration > 500) {
    durationColor = colors.yellow;
  }

  const methodColor = getMethodColor(method, colors);

  console.log(
    `${colors.gray}[${timestamp}]${colors.reset} ` +
    `${methodColor}${method.padEnd(6)}${colors.reset} ` +
    `${colors.cyan}${url}${colors.reset} ` +
    `${statusColor}${statusCode}${colors.reset} ` +
    `${durationColor}${duration}ms${colors.reset} ` +
    `${colors.gray}${ip}${colors.reset}`
  );
}

// Get color for HTTP method
function getMethodColor(method, colors) {
  switch (method) {
    case 'GET': return colors.blue;
    case 'POST': return colors.green;
    case 'PUT': return colors.yellow;
    case 'PATCH': return colors.yellow;
    case 'DELETE': return colors.red;
    default: return colors.white;
  }
}

// Database logging for API requests
async function logToDatabase(logData, user, admin) {
  try {
    const db = getPromisifiedDb();

    // Create a simplified log entry for the database
    const logEntry = {
      method: logData.method,
      url: logData.url,
      status_code: logData.statusCode,
      duration_ms: logData.duration,
      ip_address: logData.ip,
      user_agent: logData.userAgent,
      user_id: user?.id || null,
      admin_id: admin?.id || null,
      referrer: logData.referrer,
      content_length: parseInt(logData.contentLength) || null,
      timestamp: logData.timestamp
    };

    // Insert into a request_logs table (we'll create this)
    await ensureRequestLogsTable(db);

    await db.run(`
      INSERT INTO request_logs
      (method, url, status_code, duration_ms, ip_address, user_agent, user_id, admin_id, referrer, content_length, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      logEntry.method,
      logEntry.url,
      logEntry.status_code,
      logEntry.duration_ms,
      logEntry.ip_address,
      logEntry.user_agent,
      logEntry.user_id,
      logEntry.admin_id,
      logEntry.referrer,
      logEntry.content_length,
      logEntry.timestamp
    ]);

  } catch (error) {
    console.error('Failed to log request to database:', error);
    // Don't throw - logging should never break the application
  }
}

// Ensure request_logs table exists
async function ensureRequestLogsTable(db) {
  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS request_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        method TEXT NOT NULL,
        url TEXT NOT NULL,
        status_code INTEGER NOT NULL,
        duration_ms INTEGER NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        user_id INTEGER,
        admin_id INTEGER,
        referrer TEXT,
        content_length INTEGER,
        timestamp DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
        FOREIGN KEY (admin_id) REFERENCES admin_users (id) ON DELETE SET NULL
      )
    `);

    // Create index for better performance
    await db.run('CREATE INDEX IF NOT EXISTS idx_request_logs_timestamp ON request_logs(timestamp)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_request_logs_user_id ON request_logs(user_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_request_logs_admin_id ON request_logs(admin_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_request_logs_url ON request_logs(url)');

  } catch (error) {
    console.error('Error creating request_logs table:', error);
  }
}

// Error logging function
export function logError(error, req = null, additionalInfo = {}) {
  const timestamp = new Date().toISOString();

  console.error(`\n🔴 ERROR [${timestamp}]`);
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);

  if (req) {
    console.error('Request:', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      user: req.user ? `${req.user.email} (${req.user.uuid})` : 'Anonymous',
      admin: req.admin ? `${req.admin.email} (${req.admin.uuid})` : null
    });
  }

  if (Object.keys(additionalInfo).length > 0) {
    console.error('Additional Info:', additionalInfo);
  }

  console.error(''); // Empty line for readability
}

// Performance monitoring function
export function trackPerformance(label, fn) {
  return async (...args) => {
    const start = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - start;

      // Log slow operations (> 1 second)
      if (duration > 1000) {
        console.warn(`⚡ SLOW OPERATION: ${label} took ${duration}ms`);
      }

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`❌ FAILED OPERATION: ${label} failed after ${duration}ms`);
      throw error;
    }
  };
}

// API rate limiting log
export function logRateLimit(req, res, next) {
  // Add rate limit info to response headers
  res.on('finish', () => {
    if (res.getHeaders()['x-ratelimit-remaining']) {
      const remaining = res.getHeaders()['x-ratelimit-remaining'];
      const limit = res.getHeaders()['x-ratelimit-limit'];

      if (remaining < limit * 0.1) { // Less than 10% remaining
        console.warn(`⚠️  RATE LIMIT WARNING: ${req.ip} has ${remaining}/${limit} requests remaining`);
      }
    }
  });

  next();
}
