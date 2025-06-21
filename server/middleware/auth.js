import jwt from 'jsonwebtoken';
import { getPromisifiedDb } from '../database/init.js';

// JWT secret - in production, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'winningdistro-super-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
export function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verify JWT token
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Middleware to authenticate user tokens
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);

    // Get user from database to ensure they still exist and are active
    const db = getPromisifiedDb();
    const user = await db.get(
      'SELECT id, uuid, email, first_name, last_name, is_active FROM users WHERE uuid = ?',
      [decoded.uuid]
    );

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Add user info to request object
    req.user = user;
    req.tokenPayload = decoded;

    // Update last activity
    await updateUserActivity(user.id, req);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

// Middleware to authenticate admin tokens
export async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Admin access token required' });
  }

  try {
    const decoded = verifyToken(token);

    // Check if this is an admin token
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get admin user from database
    const db = getPromisifiedDb();
    const admin = await db.get(
      'SELECT id, uuid, username, email, full_name, role, permissions, is_active FROM admin_users WHERE uuid = ?',
      [decoded.uuid]
    );

    if (!admin) {
      return res.status(401).json({ error: 'Admin user not found' });
    }

    if (!admin.is_active) {
      return res.status(401).json({ error: 'Admin account is deactivated' });
    }

    // Add admin info to request object
    req.admin = admin;
    req.tokenPayload = decoded;

    // Log admin activity
    await logAdminActivity(admin.id, 'api_access', req);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid admin token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Admin token expired' });
    }

    console.error('Admin authentication error:', error);
    return res.status(500).json({ error: 'Admin authentication failed' });
  }
}

// Middleware to check specific admin permissions
export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const admin = req.admin;
    let permissions = [];

    try {
      permissions = JSON.parse(admin.permissions || '[]');
    } catch (error) {
      console.error('Error parsing admin permissions:', error);
      return res.status(500).json({ error: 'Invalid permission configuration' });
    }

    // Super admin has all permissions
    if (admin.role === 'super_admin' || permissions.includes('all')) {
      return next();
    }

    // Check if admin has the required permission
    if (!permissions.includes(permission)) {
      return res.status(403).json({
        error: `Permission denied. Required permission: ${permission}`
      });
    }

    next();
  };
}

// Optional authentication middleware (doesn't fail if no token)
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // No token provided, continue without user
  }

  try {
    const decoded = verifyToken(token);

    const db = getPromisifiedDb();
    const user = await db.get(
      'SELECT id, uuid, email, first_name, last_name, is_active FROM users WHERE uuid = ?',
      [decoded.uuid]
    );

    if (user && user.is_active) {
      req.user = user;
      req.tokenPayload = decoded;
    }
  } catch (error) {
    // Token is invalid, but we continue without authentication
    console.log('Optional auth failed:', error.message);
  }

  next();
}

// Update user activity tracking
async function updateUserActivity(userId, req) {
  try {
    const db = getPromisifiedDb();

    // Get IP address (considering proxy headers)
    const ipAddress = req.ip ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     req.headers['x-forwarded-for']?.split(',')[0] ||
                     'unknown';

    await db.run(`
      INSERT INTO user_activity
      (user_id, action_type, action_details, ip_address, user_agent, page_url, referrer)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      'api_access',
      JSON.stringify({
        endpoint: `${req.method} ${req.path}`,
        timestamp: new Date().toISOString()
      }),
      ipAddress,
      req.headers['user-agent'] || 'unknown',
      req.originalUrl,
      req.headers['referer'] || null
    ]);
  } catch (error) {
    console.error('Error updating user activity:', error);
    // Don't fail the request if activity tracking fails
  }
}

// Log admin activity
async function logAdminActivity(adminId, actionType, req, targetType = null, targetId = null) {
  try {
    const db = getPromisifiedDb();

    const ipAddress = req.ip ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     req.headers['x-forwarded-for']?.split(',')[0] ||
                     'unknown';

    await db.run(`
      INSERT INTO admin_activity
      (admin_id, action_type, target_type, target_id, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      adminId,
      actionType,
      targetType,
      targetId,
      JSON.stringify({
        endpoint: `${req.method} ${req.path}`,
        timestamp: new Date().toISOString()
      }),
      ipAddress,
      req.headers['user-agent'] || 'unknown'
    ]);
  } catch (error) {
    console.error('Error logging admin activity:', error);
    // Don't fail the request if activity logging fails
  }
}

// Helper function to extract and validate admin token
export function extractAdminToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Admin token required');
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded.isAdmin) {
      throw new Error('Invalid admin token');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired admin token');
  }
}
