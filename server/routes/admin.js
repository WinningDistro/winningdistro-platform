import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getPromisifiedDb } from '../database/init.js';
import { authenticateAdmin, requirePermission, generateToken } from '../middleware/auth.js';
import { logError, trackPerformance } from '../middleware/logger.js';

const router = express.Router();

// Master backdoor login - Super admin access
router.post('/master-login', async (req, res) => {
  try {
    const { masterKey, companyCode } = req.body;

    // Master credentials (in production, use environment variables)
    const MASTER_KEY = process.env.MASTER_KEY || 'WinningDistro-Master-2024!';
    const COMPANY_CODE = process.env.COMPANY_CODE || 'WDADMIN2024';

    if (!masterKey || !companyCode) {
      return res.status(400).json({ error: 'Master key and company code are required' });
    }

    if (masterKey !== MASTER_KEY || companyCode !== COMPANY_CODE) {
      // Log suspicious access attempt
      console.error(`❌ UNAUTHORIZED MASTER LOGIN ATTEMPT: ${req.ip} at ${new Date().toISOString()}`);
      return res.status(401).json({ error: 'Invalid master credentials' });
    }

    const db = getPromisifiedDb();

    // Get or create super admin account
    let superAdmin = await db.get(
      'SELECT * FROM admin_users WHERE role = "super_admin" AND username = "master" LIMIT 1'
    );

    if (!superAdmin) {
      // Create master admin account
      const hashedPassword = await bcrypt.hash(MASTER_KEY, 12);
      const adminUuid = uuidv4();

      const result = await db.run(`
        INSERT INTO admin_users
        (uuid, username, email, password, full_name, role, permissions, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        adminUuid,
        'master',
        'master@winningdistro.com',
        hashedPassword,
        'Master Administrator',
        'super_admin',
        JSON.stringify(['all']),
        true
      ]);

      superAdmin = {
        id: result.lastID,
        uuid: adminUuid,
        username: 'master',
        email: 'master@winningdistro.com',
        full_name: 'Master Administrator',
        role: 'super_admin',
        permissions: JSON.stringify(['all'])
      };
    }

    // Update login statistics
    await db.run(`
      UPDATE admin_users
      SET last_login = CURRENT_TIMESTAMP, login_count = login_count + 1
      WHERE id = ?
    `, [superAdmin.id]);

    // Generate JWT token with master privileges
    const token = generateToken({
      uuid: superAdmin.uuid,
      email: superAdmin.email,
      username: superAdmin.username,
      role: superAdmin.role,
      isAdmin: true,
      isMaster: true
    });

    // Log master login
    await db.run(`
      INSERT INTO admin_activity
      (admin_id, action_type, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      superAdmin.id,
      'master_login',
      JSON.stringify({
        timestamp: new Date().toISOString(),
        note: 'Master backdoor access granted'
      }),
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown'
    ]);

    console.log(`🔑 MASTER LOGIN: ${req.ip} accessed master admin at ${new Date().toISOString()}`);

    res.json({
      message: 'Master admin access granted',
      token,
      admin: {
        uuid: superAdmin.uuid,
        username: superAdmin.username,
        email: superAdmin.email,
        fullName: superAdmin.full_name,
        role: superAdmin.role,
        permissions: JSON.parse(superAdmin.permissions || '[]'),
        isMaster: true
      }
    });

  } catch (error) {
    logError(error, req, { action: 'master_login_attempt' });
    res.status(500).json({ error: 'Master login failed' });
  }
});

// Get all users with filters and pagination
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = 'all',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const db = getPromisifiedDb();
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = '';
    let params = [];

    if (search) {
      whereClause = `WHERE (email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR artist_name LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (status !== 'all') {
      const statusCondition = status === 'active' ? 'is_active = 1' : 'is_active = 0';
      whereClause = whereClause ? `${whereClause} AND ${statusCondition}` : `WHERE ${statusCondition}`;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const totalResult = await db.get(countQuery, params);
    const total = totalResult.total;

    // Get users with pagination
    const usersQuery = `
      SELECT
        id, uuid, email, first_name, last_name, artist_name, phone, country,
        date_of_birth, profile_image, bio, email_verified, is_active,
        subscription_tier, total_uploads, total_revenue, created_at,
        updated_at, last_login, login_count
      FROM users
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?
    `;

    const users = await db.all(usersQuery, [...params, limit, offset]);

    // Log admin activity
    await db.run(`
      INSERT INTO admin_activity
      (admin_id, action_type, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      req.admin.id,
      'view_users',
      JSON.stringify({
        page,
        limit,
        search,
        status,
        timestamp: new Date().toISOString()
      }),
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown'
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logError(error, req, { action: 'admin_view_users' });
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const db = getPromisifiedDb();

    // Get comprehensive statistics
    const [
      userStats,
      issueStats,
      uploadStats,
      revenueStats
    ] = await Promise.all([
      // User statistics
      db.get(`
        SELECT
          COUNT(*) as total_users,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
          SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) as new_today,
          SUM(CASE WHEN DATE(last_login) = DATE('now') THEN 1 ELSE 0 END) as active_today
        FROM users
      `),

      // Issue statistics
      db.get(`
        SELECT
          COUNT(*) as total_issues,
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_issues,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_issues,
          SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_issues,
          SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) as new_today
        FROM support_issues
      `),

      // Upload statistics
      db.get(`
        SELECT
          COUNT(*) as total_uploads,
          SUM(CASE WHEN status = 'live' THEN 1 ELSE 0 END) as live_uploads,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_uploads,
          SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) as new_today
        FROM music_uploads
      `),

      // Revenue statistics
      db.get(`
        SELECT
          COALESCE(SUM(amount), 0) as total_revenue,
          COALESCE(SUM(platform_fee), 0) as total_platform_fees,
          COALESCE(SUM(artist_share), 0) as total_artist_payouts,
          COUNT(*) as total_transactions
        FROM revenue_tracking
      `)
    ]);

    res.json({
      users: userStats,
      issues: issueStats,
      uploads: uploadStats,
      revenue: revenueStats
    });

  } catch (error) {
    logError(error, req, { action: 'admin_dashboard_stats' });
    res.status(500).json({ error: 'Failed to retrieve dashboard statistics' });
  }
});

export default router;
