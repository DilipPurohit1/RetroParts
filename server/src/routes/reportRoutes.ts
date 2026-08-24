import express from 'express';
import { Report } from '../models/Report.js';
import { protect, requireRole, AuthRequest } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/v1/reports
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.', errorCode: 'UNAUTHORIZED' });
      return;
    }
    const { targetType = 'listing', targetId, listingId, reason, details } = req.body;
    const resolvedTargetId = targetId || listingId;

    if (!resolvedTargetId || !reason) {
      res.status(400).json({ success: false, message: 'targetId and reason are required.', errorCode: 'INVALID_INPUT' });
      return;
    }

    const report = await Report.create({
      reporterId: req.user._id,
      reporter: req.user._id,
      targetType: targetType === 'user' ? 'user' : 'listing',
      targetId: resolvedTargetId,
      listing: targetType === 'listing' ? resolvedTargetId : undefined,
      reason,
      details: details || '',
      status: 'open',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully for moderation review.',
      report,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
});

// GET /api/v1/reports (Admin only)
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const query: any = {};
    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('reporterId', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports, reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
});

// PATCH /api/v1/reports/:id (Admin resolve)
router.patch('/:id', protect, requireRole('admin'), async (req: AuthRequest, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) {
      res.status(404).json({ success: false, message: 'Report not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    report.status = status || 'resolved';
    report.resolvedBy = req.user?._id;
    await report.save();

    res.json({ success: true, message: 'Report updated.', report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
});

export default router;
