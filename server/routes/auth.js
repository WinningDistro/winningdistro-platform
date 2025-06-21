import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { neonDB } from '../database/neon.js';
import { getPromisifiedDb } from '../database/init.js';
import { generateToken, verifyToken, authenticateToken } from '../middleware/auth.js';
import { logError, trackPerformance } from '../middleware/logger.js';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      artistName,
      stageName,
      userType,
      industry,
      country,
      companyName,
      instagramHandle,
      spotifyProfile,
      soundcloudProfile,
      youtubeChannel,
      website,
      recaptchaToken,
      newsletter
    } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Email, password, first name, and last name are required'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
    }

    // Validate hCaptcha token (TODO: implement server-side verification)
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Captcha verification required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Try Neon database first, fallback to SQLite
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl && !databaseUrl.includes('username:password')) {
      try {
        // Use Neon database
        const existingUser = await neonDB.getUserByEmail(email.toLowerCase());
        if (existingUser) {
          return res.status(409).json({ error: 'User already exists with this email' });
        }

        const userData = {
          email: email.toLowerCase(),
          passwordHash: hashedPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          artistName: artistName ? artistName.trim() : null,
          stageName: stageName ? stageName.trim() : null,
          userType: userType || 'artist',
          industry: industry || null,
          country: country || null,
          companyName: companyName ? companyName.trim() : null,
          instagramHandle: instagramHandle ? instagramHandle.trim() : null,
          spotifyProfile: spotifyProfile ? spotifyProfile.trim() : null,
          soundcloudProfile: soundcloudProfile ? soundcloudProfile.trim() : null,
          youtubeChannel: youtubeChannel ? youtubeChannel.trim() : null,
          website: website ? website.trim() : null
        };

        const newUser = await neonDB.createUser(userData);

        const token = generateToken({
          id: newUser.id,
          email: newUser.email,
          isAdmin: false
        });

        await neonDB.logActivity(
          newUser.id,
          'register',
          'user',
          newUser.id,
          req.ip || req.connection.remoteAddress || 'unknown',
          req.headers['user-agent'] || 'unknown',
          {
            userType: userType || 'artist',
            newsletter: newsletter || false,
            timestamp: new Date().toISOString()
          }
        );

        return res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            artistName: newUser.artist_name,
            userType: newUser.user_type
          }
        });
      } catch (neonError) {
        console.warn('Neon database error, falling back to SQLite:', neonError.message);
      }
    }

    // Fallback to SQLite database
    const db = getPromisifiedDb();

    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const userUuid = uuidv4();

    // Create user in SQLite
    const result = await db.run(`
      INSERT INTO users
      (uuid, email, password, first_name, last_name, artist_name, phone, country, date_of_birth)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userUuid,
      email.toLowerCase(),
      hashedPassword,
      firstName.trim(),
      lastName.trim(),
      artistName ? artistName.trim() : null,
      instagramHandle ? instagramHandle.trim() : null,
      country ? country.trim() : null,
      null // date_of_birth
    ]);

    // Generate JWT token for SQLite
    const token = generateToken({
      uuid: userUuid,
      email: email.toLowerCase(),
      isAdmin: false
    });

    // Log user activity in SQLite
    await db.run(`
      INSERT INTO user_activity
      (user_id, action_type, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      result.lastID,
      'register',
      JSON.stringify({
        userType: userType || 'artist',
        newsletter: newsletter || false,
        timestamp: new Date().toISOString()
      }),
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown'
    ]);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        uuid: userUuid,
        email: email.toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        artistName: artistName || null,
        userType: userType || 'artist'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    logError(error, req, { action: 'user_registration' });
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getPromisifiedDb();

    // Find user
    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update login statistics
    await db.run(`
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP, login_count = login_count + 1
      WHERE id = ?
    `, [user.id]);

    // Generate JWT token
    const token = generateToken({
      uuid: user.uuid,
      email: user.email,
      isAdmin: false
    });

    // Log user activity
    await db.run(`
      INSERT INTO user_activity
      (user_id, action_type, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      user.id,
      'login',
      JSON.stringify({ timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown'
    ]);

    res.json({
      message: 'Login successful',
      token,
      user: {
        uuid: user.uuid,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        artistName: user.artist_name,
        profileImage: user.profile_image,
        subscriptionTier: user.subscription_tier,
        totalUploads: user.total_uploads,
        totalRevenue: user.total_revenue
      }
    });

  } catch (error) {
    logError(error, req, { action: 'user_login' });
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = getPromisifiedDb();

    // Find admin user (can login with username or email)
    const admin = await db.get(
      'SELECT * FROM admin_users WHERE (username = ? OR email = ?) AND is_active = 1',
      [username.toLowerCase(), username.toLowerCase()]
    );

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update login statistics
    await db.run(`
      UPDATE admin_users
      SET last_login = CURRENT_TIMESTAMP, login_count = login_count + 1
      WHERE id = ?
    `, [admin.id]);

    // Generate JWT token with admin flag
    const token = generateToken({
      uuid: admin.uuid,
      email: admin.email,
      username: admin.username,
      role: admin.role,
      isAdmin: true
    });

    // Log admin activity
    await db.run(`
      INSERT INTO admin_activity
      (admin_id, action_type, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      admin.id,
      'login',
      JSON.stringify({ timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown'
    ]);

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        uuid: admin.uuid,
        username: admin.username,
        email: admin.email,
        fullName: admin.full_name,
        role: admin.role,
        permissions: JSON.parse(admin.permissions || '[]')
      }
    });

  } catch (error) {
    logError(error, req, { action: 'admin_login' });
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Verify Token (for both users and admins)
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    const db = getPromisifiedDb();

    if (decoded.isAdmin) {
      // Verify admin token
      const admin = await db.get(
        'SELECT uuid, username, email, full_name, role, permissions, is_active FROM admin_users WHERE uuid = ?',
        [decoded.uuid]
      );

      if (!admin || !admin.is_active) {
        return res.status(401).json({ error: 'Admin account not found or inactive' });
      }

      res.json({
        valid: true,
        type: 'admin',
        admin: {
          uuid: admin.uuid,
          username: admin.username,
          email: admin.email,
          fullName: admin.full_name,
          role: admin.role,
          permissions: JSON.parse(admin.permissions || '[]')
        }
      });
    } else {
      // Verify user token
      const user = await db.get(
        'SELECT uuid, email, first_name, last_name, artist_name, profile_image, subscription_tier, is_active FROM users WHERE uuid = ?',
        [decoded.uuid]
      );

      if (!user || !user.is_active) {
        return res.status(401).json({ error: 'User account not found or inactive' });
      }

      res.json({
        valid: true,
        type: 'user',
        user: {
          uuid: user.uuid,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          artistName: user.artist_name,
          profileImage: user.profile_image,
          subscriptionTier: user.subscription_tier
        }
      });
    }

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }

    logError(error, req, { action: 'token_verification' });
    res.status(500).json({ error: 'Token verification failed' });
  }
});

// Refresh Token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Generate new token with same payload but fresh expiration
    const token = generateToken({
      uuid: user.uuid,
      email: user.email,
      isAdmin: false
    });

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    logError(error, req, { action: 'token_refresh' });
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// Logout (invalidate token - for future session management)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const db = getPromisifiedDb();

    // Log user activity
    await db.run(`
      INSERT INTO user_activity
      (user_id, action_type, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      user.id,
      'logout',
      JSON.stringify({ timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown'
    ]);

    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    logError(error, req, { action: 'user_logout' });
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Password Reset Request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const db = getPromisifiedDb();
    const user = await db.get('SELECT id, email FROM users WHERE email = ?', [email.toLowerCase()]);

    // Always respond with success for security (don't reveal if email exists)
    res.json({
      message: 'If an account with that email exists, password reset instructions have been sent.'
    });

    // TODO: Implement actual email sending with reset token
    if (user) {
      console.log(`Password reset requested for user: ${user.email}`);
      // In a real implementation, you would:
      // 1. Generate a reset token
      // 2. Store it in database with expiration
      // 3. Send email with reset link
    }

  } catch (error) {
    logError(error, req, { action: 'password_reset_request' });
    res.status(500).json({ error: 'Password reset request failed' });
  }
});

// Get Authentication Statistics
router.get('/stats', async (req, res) => {
  try {
    const db = getPromisifiedDb();

    // Get various authentication statistics
    const [
      totalUsers,
      activeUsers,
      todayLogins,
      totalAdmins
    ] = await Promise.all([
      db.get('SELECT COUNT(*) as count FROM users'),
      db.get('SELECT COUNT(*) as count FROM users WHERE is_active = 1'),
      db.get(`
        SELECT COUNT(DISTINCT user_id) as count
        FROM user_activity
        WHERE action_type = 'login'
        AND DATE(created_at) = DATE('now')
      `),
      db.get('SELECT COUNT(*) as count FROM admin_users WHERE is_active = 1')
    ]);

    res.json({
      users: {
        total: totalUsers.count,
        active: activeUsers.count,
        todayLogins: todayLogins.count
      },
      admins: {
        total: totalAdmins.count
      }
    });

  } catch (error) {
    logError(error, req, { action: 'get_auth_stats' });
    res.status(500).json({ error: 'Failed to get authentication statistics' });
  }
});

export default router;
