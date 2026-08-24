import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/', protect, getConversations);
router.get('/messages/:conversationId', protect, getMessages);
router.get('/:conversationId', protect, getMessages);
router.post('/messages', protect, sendMessage);
router.post('/send', protect, sendMessage);
router.post('/', protect, sendMessage);
router.put('/conversations/:conversationId/read', protect, markAsRead);
router.put('/:conversationId/read', protect, markAsRead);

export default router;
