import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

// Create Neon database connection
const sql = neon(process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/winningdistro');

// Initialize database tables
async function initializeNeonDatabase() {
  try {
    console.log('🔄 Initializing Neon database...');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        artist_name VARCHAR(255),
        stage_name VARCHAR(255),
        user_type VARCHAR(50) DEFAULT 'artist',
        industry VARCHAR(100),
        country VARCHAR(3),
        company_name VARCHAR(255),
        instagram_handle VARCHAR(255),
        spotify_profile VARCHAR(255),
        soundcloud_profile VARCHAR(255),
        youtube_channel VARCHAR(255),
        website VARCHAR(255),
        phone VARCHAR(50),
        is_verified BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE,
        subscription_tier VARCHAR(50) DEFAULT 'free',
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create user_metadata table for flexible data storage
    await sql`
      CREATE TABLE IF NOT EXISTS user_metadata (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        metadata_key VARCHAR(100) NOT NULL,
        metadata_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, metadata_key)
      )
    `;

    // Create user_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        ip_address INET,
        user_agent TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create issues table for support tickets
    await sql`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        priority VARCHAR(50) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'open',
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create activity_logs table for tracking
    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100),
        resource_id INTEGER,
        ip_address INET,
        user_agent TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_issues_user_id ON issues(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity_logs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_logs(action)`;

    // Create admin user if not exists (backdoor access)
    const adminEmail = 'admin@winningdistro.com';
    const adminUsers = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;

    if (adminUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('WinningDistro2024!', 10);

      await sql`
        INSERT INTO users (
          email, password_hash, first_name, last_name,
          user_type, is_admin, is_verified
        ) VALUES (
          ${adminEmail}, ${hashedPassword}, 'Admin', 'User',
          'admin', TRUE, TRUE
        )
      `;
      console.log('✅ Admin user created');
    }

    console.log('✅ Neon database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing Neon database:', error);
    throw error;
  }
}

// Database operations
const neonDB = {
  // Initialize database
  init: initializeNeonDatabase,

  // User operations
  async createUser(userData) {
    try {
      const {
        email, passwordHash, firstName, lastName, artistName, stageName,
        userType, industry, country, companyName, instagramHandle,
        spotifyProfile, soundcloudProfile, youtubeChannel, website
      } = userData;

      const result = await sql`
        INSERT INTO users (
          email, password_hash, first_name, last_name, artist_name, stage_name,
          user_type, industry, country, company_name, instagram_handle,
          spotify_profile, soundcloud_profile, youtube_channel, website
        ) VALUES (
          ${email}, ${passwordHash}, ${firstName}, ${lastName}, ${artistName}, ${stageName},
          ${userType}, ${industry}, ${country}, ${companyName}, ${instagramHandle},
          ${spotifyProfile}, ${soundcloudProfile}, ${youtubeChannel}, ${website}
        ) RETURNING id, email, first_name, last_name, artist_name, user_type, created_at
      `;

      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE email = ${email} LIMIT 1
      `;
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  async getUserById(id) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE id = ${id} LIMIT 1
      `;
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  },

  async getAllUsers(limit = 100, offset = 0) {
    try {
      const result = await sql`
        SELECT id, email, first_name, last_name, artist_name, user_type,
               is_verified, created_at, last_login
        FROM users
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  // Session operations
  async createSession(userId, sessionToken, expiresAt, ipAddress, userAgent) {
    try {
      const result = await sql`
        INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
        VALUES (${userId}, ${sessionToken}, ${expiresAt}, ${ipAddress}, ${userAgent})
        RETURNING *
      `;
      return result[0];
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  async getSessionByToken(sessionToken) {
    try {
      const result = await sql`
        SELECT s.*, u.id as user_id, u.email, u.first_name, u.last_name,
               u.artist_name, u.user_type, u.is_admin
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = ${sessionToken}
          AND s.is_active = TRUE
          AND s.expires_at > NOW()
        LIMIT 1
      `;
      return result[0] || null;
    } catch (error) {
      console.error('Error getting session by token:', error);
      throw error;
    }
  },

  // Issue operations
  async createIssue(userId, title, description, category) {
    try {
      const result = await sql`
        INSERT INTO issues (user_id, title, description, category)
        VALUES (${userId}, ${title}, ${description}, ${category})
        RETURNING *
      `;
      return result[0];
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  },

  async getAllIssues(limit = 50, offset = 0) {
    try {
      const result = await sql`
        SELECT i.*, u.email, u.first_name, u.last_name, u.artist_name
        FROM issues i
        LEFT JOIN users u ON i.user_id = u.id
        ORDER BY i.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    } catch (error) {
      console.error('Error getting all issues:', error);
      throw error;
    }
  },

  // Activity logging
  async logActivity(userId, action, resourceType, resourceId, ipAddress, userAgent, metadata) {
    try {
      await sql`
        INSERT INTO activity_logs (
          user_id, action, resource_type, resource_id,
          ip_address, user_agent, metadata
        ) VALUES (
          ${userId}, ${action}, ${resourceType}, ${resourceId},
          ${ipAddress}, ${userAgent}, ${JSON.stringify(metadata)}
        )
      `;
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw - logging failures shouldn't break app
    }
  },

  // Statistics
  async getUserStats() {
    try {
      const result = await sql`
        SELECT
          COUNT(*) as total_users,
          COUNT(CASE WHEN user_type = 'artist' THEN 1 END) as artists,
          COUNT(CASE WHEN user_type = 'label' THEN 1 END) as labels,
          COUNT(CASE WHEN user_type = 'producer' THEN 1 END) as producers,
          COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_users,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d
        FROM users
      `;
      return result[0];
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }
};

export { neonDB, sql };
