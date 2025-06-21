import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enable verbose mode for better debugging
const sqlite = sqlite3.verbose();

// Database path
const DB_PATH = join(__dirname, '../../data/winningdistro.db');

let db;

// Initialize database connection
export function getDatabase() {
  if (!db) {
    db = new sqlite.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        throw err;
      }
      console.log('📁 Connected to SQLite database');
    });

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  }
  return db;
}

// Promisify database methods
export function getPromisifiedDb() {
  const database = getDatabase();
  return {
    run: promisify(database.run.bind(database)),
    get: promisify(database.get.bind(database)),
    all: promisify(database.all.bind(database)),
    close: promisify(database.close.bind(database))
  };
}

// Database schema creation
export async function initializeDatabase() {
  const db = getPromisifiedDb();

  try {
    // Create users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        artist_name TEXT,
        phone TEXT,
        country TEXT,
        date_of_birth DATE,
        profile_image TEXT,
        bio TEXT,
        social_links TEXT, -- JSON string
        email_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        subscription_tier TEXT DEFAULT 'free', -- free, basic, premium
        total_uploads INTEGER DEFAULT 0,
        total_revenue DECIMAL(10,2) DEFAULT 0.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        login_count INTEGER DEFAULT 0
      )
    `);

    // Create user sessions table for tracking active sessions
    await db.run(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_token TEXT UNIQUE NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        device_info TEXT,
        location TEXT, -- JSON string with city, country, etc.
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create user activity tracking table
    await db.run(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        action_type TEXT NOT NULL, -- login, logout, upload, download, view_dashboard, etc.
        action_details TEXT, -- JSON string with additional info
        ip_address TEXT,
        user_agent TEXT,
        page_url TEXT,
        referrer TEXT,
        session_duration INTEGER, -- in seconds
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create music uploads table
    await db.run(`
      CREATE TABLE IF NOT EXISTS music_uploads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        uuid TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        album TEXT,
        genre TEXT,
        release_date DATE,
        isrc_code TEXT UNIQUE,
        upc_code TEXT,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        duration INTEGER, -- in seconds
        file_format TEXT,
        artwork_path TEXT,
        status TEXT DEFAULT 'pending', -- pending, processing, approved, rejected, live
        revenue_generated DECIMAL(10,2) DEFAULT 0.00,
        play_count INTEGER DEFAULT 0,
        download_count INTEGER DEFAULT 0,
        metadata TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create support issues table
    await db.run(`
      CREATE TABLE IF NOT EXISTS support_issues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        ticket_number TEXT UNIQUE NOT NULL,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL, -- technical, billing, general, etc.
        priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
        status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
        assigned_to INTEGER, -- admin user ID
        resolution TEXT,
        attachments TEXT, -- JSON array of file paths
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES admin_users (id)
      )
    `);

    // Create issue comments table
    await db.run(`
      CREATE TABLE IF NOT EXISTS issue_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id INTEGER NOT NULL,
        user_id INTEGER,
        admin_id INTEGER,
        comment TEXT NOT NULL,
        is_internal BOOLEAN DEFAULT FALSE, -- true for admin-only comments
        attachments TEXT, -- JSON array of file paths
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (issue_id) REFERENCES support_issues (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
        FOREIGN KEY (admin_id) REFERENCES admin_users (id) ON DELETE SET NULL
      )
    `);

    // Create admin users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT DEFAULT 'admin', -- admin, super_admin, support, manager
        permissions TEXT, -- JSON array of permissions
        is_active BOOLEAN DEFAULT TRUE,
        last_login DATETIME,
        login_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER,
        FOREIGN KEY (created_by) REFERENCES admin_users (id)
      )
    `);

    // Create admin activity log
    await db.run(`
      CREATE TABLE IF NOT EXISTS admin_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER NOT NULL,
        action_type TEXT NOT NULL, -- user_view, user_edit, issue_resolve, etc.
        target_type TEXT, -- user, issue, upload, etc.
        target_id INTEGER,
        action_details TEXT, -- JSON string
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admin_users (id) ON DELETE CASCADE
      )
    `);

    // Create revenue tracking table
    await db.run(`
      CREATE TABLE IF NOT EXISTS revenue_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        upload_id INTEGER,
        amount DECIMAL(10,2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        source TEXT, -- spotify, apple_music, etc.
        transaction_type TEXT, -- royalty, payout, etc.
        transaction_date DATE NOT NULL,
        payout_status TEXT DEFAULT 'pending', -- pending, processed, failed
        platform_fee DECIMAL(10,2),
        artist_share DECIMAL(10,2),
        metadata TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (upload_id) REFERENCES music_uploads (id) ON DELETE SET NULL
      )
    `);

    // Create system settings table
    await db.run(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        setting_type TEXT DEFAULT 'string', -- string, number, boolean, json
        description TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        updated_by INTEGER,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (updated_by) REFERENCES admin_users (id)
      )
    `);

    // Create indexes for better performance
    await db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_music_uploads_user_id ON music_uploads(user_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_support_issues_user_id ON support_issues(user_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_support_issues_status ON support_issues(status)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity(admin_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_revenue_tracking_user_id ON revenue_tracking(user_id)');

    // Create default admin user if it doesn't exist
    await createDefaultAdmin();

    // Insert default system settings
    await insertDefaultSettings();

    console.log('✅ Database schema created successfully');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Create default admin user
async function createDefaultAdmin() {
  const db = getPromisifiedDb();

  try {
    const existingAdmin = await db.get('SELECT id FROM admin_users WHERE role = "super_admin" LIMIT 1');

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('WinningDistro2024!', 12);
      const { v4: uuidv4 } = await import('uuid');

      await db.run(`
        INSERT INTO admin_users
        (uuid, username, email, password, full_name, role, permissions, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        'superadmin',
        'admin@winningdistro.com',
        hashedPassword,
        'Super Administrator',
        'super_admin',
        JSON.stringify(['all']),
        true
      ]);

      console.log('🔑 Default admin user created:');
      console.log('   Username: superadmin');
      console.log('   Email: admin@winningdistro.com');
      console.log('   Password: WinningDistro2024!');
      console.log('   ⚠️  Please change the default password after first login!');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

// Insert default system settings
async function insertDefaultSettings() {
  const db = getPromisifiedDb();

  const defaultSettings = [
    { key: 'platform_fee_percentage', value: '15', type: 'number', description: 'Platform fee percentage (15% by default)', public: true },
    { key: 'artist_payout_percentage', value: '85', type: 'number', description: 'Artist payout percentage (85% by default)', public: true },
    { key: 'signup_fee', value: '0', type: 'number', description: 'Signup fee for new users', public: true },
    { key: 'max_upload_size_mb', value: '100', type: 'number', description: 'Maximum upload size in MB', public: false },
    { key: 'supported_formats', value: '["mp3", "wav", "flac", "m4a"]', type: 'json', description: 'Supported audio formats', public: true },
    { key: 'isrc_prefix', value: 'US-WD1', type: 'string', description: 'ISRC code prefix for generated codes', public: false },
    { key: 'maintenance_mode', value: 'false', type: 'boolean', description: 'Enable maintenance mode', public: true },
    { key: 'new_user_welcome_email', value: 'true', type: 'boolean', description: 'Send welcome email to new users', public: false },
  ];

  try {
    for (const setting of defaultSettings) {
      const existing = await db.get('SELECT id FROM system_settings WHERE setting_key = ?', [setting.key]);

      if (!existing) {
        await db.run(`
          INSERT INTO system_settings
          (setting_key, setting_value, setting_type, description, is_public)
          VALUES (?, ?, ?, ?, ?)
        `, [setting.key, setting.value, setting.type, setting.description, setting.public]);
      }
    }

    console.log('⚙️ Default system settings initialized');
  } catch (error) {
    console.error('Error inserting default settings:', error);
  }
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}
