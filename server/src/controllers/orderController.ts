import { Request, Response } from 'express';
import { Order, IOrderItem } from '../models/Order.js';
import { Listing } from '../models/Listing.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { emitToUser } from '../services/socketService.js';

// TODO: Production payment gateway integration (Razorpay / Stripe)
// Currently orders are vaulted under RetroParts Escrow Inspection Protection with mock payment verification.

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ success: false, message: 'No items in order.' });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city) {
      res.status(400).json({ success: false, message: 'Complete shipping address is required.' });
      return;
    }

    // Process items and verify stock
    let subtotal = 0;
    const orderItems: IOrderItem[] = [];
    const sellerIds = new Set<string>();

    for (const item of items) {
      const listing = await Listing.findById(item.listingId || item.listing);
      if (!listing) {
        res.status(400).json({ success: false, message: `Listing not found for item: ${item.title}` });
        return;
      }

      const qty = Number(item.quantity) || 1;
      const price = listing.price;
      subtotal += price * qty;

      orderItems.push({
        listing: listing._id as any,
        title: listing.title,
        price,
        quantity: qty,
        image: listing.images[0] || '',
        seller: listing.seller as any,
        oemNumber: listing.oemNumber,
      });

      sellerIds.add(listing.seller.toString());

      // Decrement listing quantity or mark sold
      listing.quantity = Math.max(0, listing.quantity - qty);
      if (listing.quantity === 0) {
        listing.status = 'sold';
      }
      await listing.save();
    }

    const shippingFee = subtotal > 5000 ? 0 : 250; // Free shipping over ₹5000
    const protectionFee = 99; // Buyer inspection guarantee
    const totalAmount = subtotal + shippingFee + protectionFee;

    const orderNumber = `RP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      orderNumber,
      buyer: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'mock_card',
      paymentStatus: 'completed',
      orderStatus: 'placed',
      subtotal,
      shippingFee,
      protectionFee,
      totalAmount,
      statusHistory: [
        {
          status: 'placed',
          note: 'Order confirmed and payment verified via RetroParts Escrow Guarantee.',
          timestamp: new Date(),
        },
      ],
    });

    // Notify Buyer
    const buyerNotification = await Notification.create({
      user: req.user._id,
      type: 'order_update',
      title: 'Order Placed Successfully!',
      message: `Your order #${orderNumber} for ${items.length} item(s) (₹${totalAmount.toLocaleString('en-IN')}) is placed.`,
      link: `/dashboard?tab=orders`,
    });
    emitToUser(req.user._id.toString(), 'notification:new', buyerNotification);

    // Notify Sellers
    for (const sellerId of sellerIds) {
      const sellerNotification = await Notification.create({
        user: sellerId as any,
        type: 'order_update',
        title: 'New Part Order Received!',
        message: `You have received a new order (${orderNumber}) for your vintage parts catalog.`,
        link: `/seller?tab=orders`,
      });
      emitToUser(sellerId, 'notification:new', sellerNotification);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const orders = await Order.find({ buyer: req.user._id })
      .populate('items.seller', 'name phone location avatar isVerifiedSeller')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone')
      .populate('items.seller', 'name phone location avatar isVerifiedSeller');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Check authorization: buyer, seller of item, or admin
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = order.items.some((item) => item.seller?._id?.toString() === req.user?._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSellerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('buyer', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { status, orderStatus, trackingNumber, trackingCourier, note } = req.body;
    const targetStatus = status || orderStatus;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Update status
    order.orderStatus = targetStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingCourier) order.trackingCourier = trackingCourier;

    order.statusHistory.push({
      status: targetStatus,
      note: note || `Status updated to ${targetStatus}`,
      timestamp: new Date(),
    });

    await order.save();

    // Notify Buyer
    const buyerNotification = await Notification.create({
      user: order.buyer,
      type: 'order_update',
      title: `Order #${order.orderNumber} Status: ${targetStatus.toUpperCase()}`,
      message: note || `Your order status is now ${targetStatus}.${trackingNumber ? ` Tracking: ${trackingNumber} (${order.trackingCourier})` : ''}`,
      link: `/dashboard?tab=orders`,
    });
    emitToUser(order.buyer.toString(), 'notification:new', buyerNotification);

    res.json({
      success: true,
      message: 'Order status updated successfully.',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
