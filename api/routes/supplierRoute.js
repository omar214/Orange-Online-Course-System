import express from 'express';
const router = express.Router();
import supplierController from '../controllers/supplierController.js';
import { verifyAuth } from '../../middlewares/authMiddleware.js';

router.use(verifyAuth);

// CRUD Routes
router.post('/', supplierController.addSupplier);
router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplier);
router.delete('/:id', supplierController.deleteSupplier);
router.put('/:id', supplierController.updateSupplier);

// Logic Routes
router.patch('/:id/pay', supplierController.pay);

export default router;
