import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getPromisifiedDb } from '../database/init.js';
import { logError } from '../middleware/logger.js';

const router = express.Router();

// Create new support issue
router.post('/', async (req, res) => {
  try {
    const user = req.user;
    const { subject, description, category, priority = 'normal', attachments = [] } = req.body;

    if (!subject || !description || !category) {
      return res.status(400).json({
        error: 'Subject, description, and category are required'
      });
    }

    const db = getPromisifiedDb();

    // Generate ticket number
    const ticketNumber = `WD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const result = await db.run(`
      INSERT INTO support_issues
      (user_id, ticket_number, subject, description, category, priority, attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      ticketNumber,
      subject,
      description,
      category,
      priority,
      attachments.length > 0 ? JSON.stringify(attachments) : null
    ]);

    // Log user activity
    await db.run(`
      INSERT INTO user_activity
      (user_id, action_type, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      user.id,
      'create_support_issue',
      JSON.stringify({
        ticket_number: ticketNumber,
        category,
        priority,
        timestamp: new Date().toISOString()
      }),
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown'
    ]);

    res.status(201).json({
      message: 'Support issue created successfully',
      ticketNumber,
      issueId: result.lastID
    });

  } catch (error) {
    logError(error, req, { action: 'create_support_issue' });
    res.status(500).json({ error: 'Failed to create support issue' });
  }
});

// Get user's support issues
router.get('/', async (req, res) => {
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

    const issues = await db.all(`
      SELECT
        id, ticket_number, subject, description, category, priority,
        status, resolution, attachments, created_at, updated_at, resolved_at
      FROM support_issues
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    res.json({
      issues: issues.map(issue => ({
        ...issue,
        attachments: issue.attachments ? JSON.parse(issue.attachments) : []
      }))
    });

  } catch (error) {
    logError(error, req, { action: 'get_user_issues' });
    res.status(500).json({ error: 'Failed to get support issues' });
  }
});

// Get specific issue details
router.get('/:issueId', async (req, res) => {
  try {
    const user = req.user;
    const { issueId } = req.params;
    const db = getPromisifiedDb();

    // Get issue (ensure it belongs to the user)
    const issue = await db.get(`
      SELECT
        id, ticket_number, subject, description, category, priority,
        status, resolution, attachments, created_at, updated_at, resolved_at
      FROM support_issues
      WHERE (id = ? OR ticket_number = ?) AND user_id = ?
    `, [issueId, issueId, user.id]);

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Get issue comments
    const comments = await db.all(`
      SELECT
        id, comment, is_internal, attachments, created_at,
        CASE
          WHEN user_id IS NOT NULL THEN 'user'
          WHEN admin_id IS NOT NULL THEN 'admin'
          ELSE 'system'
        END as author_type
      FROM issue_comments
      WHERE issue_id = ? AND is_internal = 0
      ORDER BY created_at ASC
    `, [issue.id]);

    res.json({
      issue: {
        ...issue,
        attachments: issue.attachments ? JSON.parse(issue.attachments) : []
      },
      comments: comments.map(comment => ({
        ...comment,
        attachments: comment.attachments ? JSON.parse(comment.attachments) : []
      }))
    });

  } catch (error) {
    logError(error, req, { action: 'get_issue_details', issueId: req.params.issueId });
    res.status(500).json({ error: 'Failed to get issue details' });
  }
});

// Add comment to issue
router.post('/:issueId/comments', async (req, res) => {
  try {
    const user = req.user;
    const { issueId } = req.params;
    const { comment, attachments = [] } = req.body;

    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const db = getPromisifiedDb();

    // Verify issue belongs to user
    const issue = await db.get(
      'SELECT id FROM support_issues WHERE (id = ? OR ticket_number = ?) AND user_id = ?',
      [issueId, issueId, user.id]
    );

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Add comment
    await db.run(`
      INSERT INTO issue_comments
      (issue_id, user_id, comment, attachments)
      VALUES (?, ?, ?, ?)
    `, [
      issue.id,
      user.id,
      comment,
      attachments.length > 0 ? JSON.stringify(attachments) : null
    ]);

    // Update issue timestamp
    await db.run(
      'UPDATE support_issues SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [issue.id]
    );

    // Log user activity
    await db.run(`
      INSERT INTO user_activity
      (user_id, action_type, action_details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?)
    `, [
      user.id,
      'add_issue_comment',
      JSON.stringify({
        issue_id: issue.id,
        timestamp: new Date().toISOString()
      }),
      req.ip || req.connection.remoteAddress || 'unknown',
      req.headers['user-agent'] || 'unknown'
    ]);

    res.json({ message: 'Comment added successfully' });

  } catch (error) {
    logError(error, req, { action: 'add_issue_comment', issueId: req.params.issueId });
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

export default router;
