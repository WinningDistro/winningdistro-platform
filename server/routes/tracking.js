import express from 'express';
import { getPromisifiedDb } from '../database/init.js';
import { logError } from '../middleware/logger.js';

const router = express.Router();

// Track user activity
router.post('/activity', async (req, res) => {
  try {
    const user = req.user;
    const {
      actionType,
      actionDetails,
      pageUrl,
      referrer,
      sessionDuration
    } = req.body;

    const db = getPromisifiedDb();

    await db.run(`
      INSERT INTO user_activity
      (user_id, action_type, action_details, ip_address, user_agent, page_url, referrer, session_duration)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      actionType,
      actionDetails ? JSON.stringify(actionDetails) : null,
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown',
      pageUrl,
      referrer,
      sessionDuration
    ]);

    res.json({ message: 'Activity tracked successfully' });

  } catch (error) {
    logError(error, req, { action: 'track_user_activity' });
    res.status(500).json({ error: 'Failed to track activity' });
  }
});

// Get user activity history
router.get('/activity', async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20, actionType = 'all' } = req.query;
    const db = getPromisifiedDb();
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE user_id = ?';
    let params = [user.id];

    if (actionType !== 'all') {
      whereClause += ' AND action_type = ?';
      params.push(actionType);
    }

    const activities = await db.all(`
      SELECT
        action_type, action_details, ip_address, page_url,
        referrer, session_duration, created_at
      FROM user_activity
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    res.json({
      activities: activities.map(activity => ({
        ...activity,
        action_details: activity.action_details ? JSON.parse(activity.action_details) : null
      }))
    });

  } catch (error) {
    logError(error, req, { action: 'get_user_activity' });
    res.status(500).json({ error: 'Failed to get activity history' });
  }
});

export default router;
