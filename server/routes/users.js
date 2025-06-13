import express from 'express';
import { getPromisifiedDb } from '../database/init.js';
import { logError } from '../middleware/logger.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = req.user;
    const db = getPromisifiedDb();

    // Get full user profile
    const profile = await db.get(`
      SELECT
        uuid, email, first_name, last_name, artist_name, phone, country,
        date_of_birth, profile_image, bio, social_links, email_verified,
        subscription_tier, total_uploads, total_revenue, created_at,
        last_login, login_count
      FROM users
      WHERE id = ?
    `, [user.id]);

    res.json({
      user: {
        ...profile,
        social_links: profile.social_links ? JSON.parse(profile.social_links) : null
      }
    });

  } catch (error) {
    logError(error, req, { action: 'get_user_profile' });
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const user = req.user;
    const {
      firstName,
      lastName,
      artistName,
      phone,
      country,
      dateOfBirth,
      bio,
      socialLinks
    } = req.body;

    const db = getPromisifiedDb();

    await db.run(`
      UPDATE users
      SET
        first_name = ?,
        last_name = ?,
        artist_name = ?,
        phone = ?,
        country = ?,
        date_of_birth = ?,
        bio = ?,
        social_links = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      firstName || user.first_name,
      lastName || user.last_name,
      artistName,
      phone,
      country,
      dateOfBirth,
      bio,
      socialLinks ? JSON.stringify(socialLinks) : null,
      user.id
    ]);

    // Log user activity
    await db.run(`
      INSERT INTO user_activity
      (user_id, action_type, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      user.id,
      'update_profile',
      JSON.stringify({ timestamp: new Date().toISOString() }),
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown'
    ]);

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    logError(error, req, { action: 'update_user_profile' });
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user uploads
router.get('/uploads', async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const db = getPromisifiedDb();
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE user_id = ?';
    let params = [user.id];

    if (status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const uploads = await db.all(`
      SELECT
        id, uuid, title, artist, album, genre, release_date, isrc_code,
        upc_code, file_path, file_size, duration, file_format, artwork_path,
        status, revenue_generated, play_count, download_count, metadata,
        created_at, updated_at
      FROM music_uploads
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    res.json({
      uploads: uploads.map(upload => ({
        ...upload,
        metadata: upload.metadata ? JSON.parse(upload.metadata) : null
      }))
    });

  } catch (error) {
    logError(error, req, { action: 'get_user_uploads' });
    res.status(500).json({ error: 'Failed to get uploads' });
  }
});

// Get user analytics
router.get('/analytics', async (req, res) => {
  try {
    const user = req.user;
    const db = getPromisifiedDb();

    // Get user statistics
    const [stats, recentRevenue, topTracks] = await Promise.all([
      // Basic stats
      db.get(`
        SELECT
          COUNT(*) as total_uploads,
          SUM(CASE WHEN status = 'live' THEN 1 ELSE 0 END) as live_tracks,
          SUM(revenue_generated) as total_revenue,
          SUM(play_count) as total_plays,
          SUM(download_count) as total_downloads
        FROM music_uploads
        WHERE user_id = ?
      `, [user.id]),

      // Recent revenue (last 30 days)
      db.all(`
        SELECT
          DATE(transaction_date) as date,
          SUM(artist_share) as revenue,
          COUNT(*) as transactions
        FROM revenue_tracking
        WHERE user_id = ?
        AND transaction_date >= DATE('now', '-30 days')
        GROUP BY DATE(transaction_date)
        ORDER BY date DESC
      `, [user.id]),

      // Top performing tracks
      db.all(`
        SELECT
          title, artist, revenue_generated, play_count, download_count
        FROM music_uploads
        WHERE user_id = ? AND status = 'live'
        ORDER BY revenue_generated DESC
        LIMIT 5
      `, [user.id])
    ]);

    res.json({
      stats,
      recentRevenue,
      topTracks
    });

  } catch (error) {
    logError(error, req, { action: 'get_user_analytics' });
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

export default router;
