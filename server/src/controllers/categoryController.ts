import { Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { Listing } from '../models/Listing.js';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ featured: -1, name: 1 });

    // Ensure dynamic part count reflects actual active listings
    const categoryStats = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$categoryName', count: { $sum: 1 } } },
    ]);

    const statsMap = new Map(categoryStats.map((s) => [s._id?.toLowerCase(), s.count]));

    const populatedCategories = categories.map((cat) => {
      const actualCount = statsMap.get(cat.name.toLowerCase()) || cat.partCount;
      return {
        ...cat.toObject(),
        partCount: actualCount,
      };
    });

    res.json({ success: true, data: populatedCategories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }
    res.json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
