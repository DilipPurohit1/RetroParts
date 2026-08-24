import { Request, Response } from 'express';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { emitToConversation, emitToUser } from '../services/socketService.js';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email avatar phone sellerRating isVerifiedSeller')
      .populate('listing', 'title price images vehicleBrand vehicleModel condition')
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, data: conversations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found.' });
      return;
    }

    if (!conversation.participants.some((p) => p.toString() === req.user?._id.toString())) {
      res.status(403).json({ success: false, message: 'Unauthorized to view these messages.' });
      return;
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .populate('listingReference', 'title price images')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { recipientId, conversationId, text, listingId } = req.body;

    if (!text || text.trim() === '') {
      res.status(400).json({ success: false, message: 'Message text is required.' });
      return;
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    } else if (recipientId) {
      // Find existing conversation between the two users (and optionally listing)
      conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, recipientId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, recipientId],
          listing: listingId || undefined,
          lastMessage: text,
          lastMessageAt: new Date(),
        });
      }
    }

    if (!conversation) {
      res.status(400).json({ success: false, message: 'Could not resolve conversation.' });
      return;
    }

    const recipient = conversation.participants.find((p) => p.toString() !== req.user?._id.toString());
    if (!recipient) {
      res.status(400).json({ success: false, message: 'Invalid recipient.' });
      return;
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      recipient,
      text,
      listingReference: listingId || conversation.listing,
      read: false,
    });

    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date();
    if (listingId && !conversation.listing) {
      conversation.listing = listingId;
    }
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('listingReference', 'title price images');

    // Emit live to conversation room
    emitToConversation(conversation._id.toString(), 'message:new', populatedMessage);

    // Notify recipient
    const notification = await Notification.create({
      user: recipient,
      type: 'new_message',
      title: `Message from ${req.user.name}`,
      message: text.length > 60 ? `${text.slice(0, 60)}...` : text,
      link: `/messages?conv=${conversation._id}`,
    });
    emitToUser(recipient.toString(), 'notification:new', notification);

    res.status(201).json({
      success: true,
      data: populatedMessage,
      conversationId: conversation._id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { conversationId } = req.params;
    await Message.updateMany(
      { conversation: conversationId, recipient: req.user._id, read: false },
      { read: true }
    );

    res.json({ success: true, message: 'Messages marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
