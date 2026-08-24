import express from 'express';
import {
  getMyGarageVehicles,
  addGarageVehicle,
  getGarageVehicleDetail,
  updateGarageVehicle,
  deleteGarageVehicle,
  addRestorationEntry,
} from '../controllers/garageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyGarageVehicles);
router.post('/', addGarageVehicle);
router.get('/:id', getGarageVehicleDetail);
router.patch('/:id', updateGarageVehicle);
router.delete('/:id', deleteGarageVehicle);
router.post('/:id/entries', addRestorationEntry);

export default router;
