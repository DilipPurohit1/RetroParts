import express, { Request, Response } from 'express';
import { getVehicles, getBrands, getModelsByBrand, getVehicleById, checkCompatibility } from '../controllers/vehicleController.js';

const router = express.Router();

router.get('/', getVehicles);
router.get('/brands', getBrands);
router.get('/brand/:brand/models', getModelsByBrand);
router.get('/models/:brand', getModelsByBrand);
router.get('/models', (req: Request, res: Response) => {
  const brand = req.query.brand;
  if (typeof brand === 'string') {
    req.params.brand = brand;
    return getModelsByBrand(req, res);
  }
  return getVehicles(req, res);
});
router.get('/:id', getVehicleById);
router.post('/check-compatibility', checkCompatibility);

export default router;

