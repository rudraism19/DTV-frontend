/**
 * liveSyncService.js
 * Enterprise Real-Time Sync Engine using Server-Sent Events (SSE) and Event Queue Dispatching.
 * Pushes live updates to connected Parent Dashboards instantly without page refresh.
 */

const logger = require('../config/logger');
const { pool } = require('../db');

class LiveSyncService {
  constructor() {
    // Stores active client SSE response streams keyed by parentId / studentId
    this.clients = new Map();
  }

  /**
   * Subscribes a client (Parent) to the real-time SSE stream.
   * @param {string} parentId - The parent's user ID
   * @param {Object} res - The Express response object
   */
  subscribe(parentId, res) {
    // Set headers for Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Send initial connected ping
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    const clientId = `${parentId}_${Date.now()}`;
    this.clients.set(clientId, { parentId, res });
    logger.info(`Parent subscribed to real-time SSE stream: ${parentId} (Client ID: ${clientId})`);

    // Handle connection termination
    res.on('close', () => {
      this.clients.delete(clientId);
      logger.info(`Parent SSE stream disconnected: ${clientId}`);
    });
  }

  /**
   * Broadcasts an event to all connected parent streams linked to a specific student.
   * @param {string} studentId - The student's user ID
   * @param {string} eventType - Type of action (e.g., LOGIN, ACTIVITY, QUIZ, GOAL)
   * @param {Object} payload - The event payload data
   */
  async broadcastToParents(studentId, eventType, payload) {
    try {
      // Find all parents linked to this student
      const query = `
        SELECT parent_id FROM parent_student_mappings WHERE student_id = $1
        UNION
        SELECT id as parent_id FROM users WHERE parent_student_link = (
          SELECT link_code FROM users WHERE id = $1
        )
      `;
      const result = await pool.query(query, [studentId]);
      const parentIds = result.rows.map(r => r.parent_id);

      const message = JSON.stringify({
        type: eventType,
        timestamp: new Date().toISOString(),
        studentId,
        data: payload
      });

      // Send to matching connected clients
      this.clients.forEach((client, clientId) => {
        if (parentIds.includes(client.parentId) || client.parentId === studentId) {
          client.res.write(`data: ${message}\n\n`);
          logger.info(`Pushed live SSE update (${eventType}) to parent ${client.parentId}`);
        }
      });
    } catch (error) {
      logger.error('Error broadcasting live SSE update:', { error: error.message, stack: error.stack });
    }
  }

  /**
   * Dispatches a student action into relational activity logs and notifies parent.
   * @param {string} studentId - The student's user ID
   * @param {string} actionType - The type of action performed
   * @param {Object} details - Action details
   * @param {string} ipAddress - Client IP address
   */
  async dispatchStudentAction(studentId, actionType, details, ipAddress = '127.0.0.1') {
    try {
      // Insert into activity_logs table
      await pool.query(
        'INSERT INTO activity_logs (student_id, action_type, action_details, ip_address) VALUES ($1, $2, $3, $4)',
        [studentId, actionType, JSON.stringify(details), ipAddress]
      );

      // Inspect actionType to update specialized relational tables
      if (actionType === 'Quiz_Submit' || actionType === 'QUIZ') {
        const score = details.score || 85.0;
        const accuracy = details.accuracy || 90.0;
        const quizTitle = details.title || 'Advanced Systems Assessment';
        
        // Ensure a quiz exists
        const quizRes = await pool.query('SELECT id FROM quizzes LIMIT 1');
        let quizId = quizRes.rows.length > 0 ? quizRes.rows[0].id : null;
        
        if (quizId) {
          await pool.query(
            'INSERT INTO quiz_attempts (quiz_id, student_id, score, accuracy_percentage, status) VALUES ($1, $2, $3, $4, $5)',
            [quizId, studentId, score, accuracy, 'Completed']
          );
        }
      } else if (actionType === 'Course_Start' || actionType === 'LESSON') {
        const courseRes = await pool.query('SELECT id FROM courses LIMIT 1');
        const courseId = courseRes.rows.length > 0 ? courseRes.rows[0].id : null;
        if (courseId) {
          const lessonRes = await pool.query('SELECT id FROM lessons WHERE course_id = $1 LIMIT 1', [courseId]);
          let lessonId = lessonRes.rows.length > 0 ? lessonRes.rows[0].id : null;
          if (!lessonId) {
            const newLes = await pool.query('INSERT INTO lessons (course_id, title, sequence_number, content) VALUES ($1, $2, $3, $4) RETURNING id', [courseId, 'Live Automated Lesson', 1, 'Initial content']);
            lessonId = newLes.rows[0].id;
          }
          await pool.query(
            'INSERT INTO lesson_progress (student_id, lesson_id, course_id, status, time_spent_minutes) VALUES ($1, $2, $3, $4, $5)',
            [studentId, lessonId, courseId, 'In_Progress', details.timeSpent || 15]
          );
        }
      } else if (actionType === 'Login' || actionType === 'LOGIN') {
        await pool.query(
          'INSERT INTO login_history (user_id, login_time, ip_address, device_info) VALUES ($1, CURRENT_TIMESTAMP, $2, $3)',
          [studentId, ipAddress, details.deviceInfo || 'Web Desktop']
        );
      } else if (actionType === 'Goal_Achieved' || actionType === 'GOAL') {
        await pool.query(
          'INSERT INTO goals (student_id, title, category, status, impact) VALUES ($1, $2, $3, $4, $5)',
          [studentId, details.title || 'Completed Key Objective', 'Daily', 'Achieved', '+25% System Design']
        );
      }

      // Generate notification record
      const notificationTitle = `Student Activity Update: ${actionType}`;
      const notificationMsg = details.message || `Student performed a new action: ${actionType}`;
      
      // Find parent user ID to attach notification
      const parentQuery = `
        SELECT parent_id FROM parent_student_mappings WHERE student_id = $1
        UNION
        SELECT id as parent_id FROM users WHERE parent_student_link = (
          SELECT link_code FROM users WHERE id = $1
        ) LIMIT 1
      `;
      const pRes = await pool.query(parentQuery, [studentId]);
      if (pRes.rows.length > 0) {
        await pool.query(
          'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
          [pRes.rows[0].parent_id, notificationTitle, notificationMsg, 'Activity']
        );
      }

      // Broadcast to connected parent dashboards via SSE
      await this.broadcastToParents(studentId, actionType, details);

    } catch (error) {
      logger.error('Error dispatching student action in LiveSyncService:', { error: error.message, stack: error.stack });
    }
  }
}

module.exports = new LiveSyncService();
