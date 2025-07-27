import { Router } from "express";
import { 
  createInvoiceHandler, 
  getInvoicesController,
  getInvoiceByIdController,
  updateInvoiceController,
  deleteInvoiceController,
  finalizeInvoiceController,
  duplicateInvoiceController
} from "./invoice.controller";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Crear factura
router.post('/', createInvoiceHandler);

// Obtener todas las facturas con filtros
router.get('/', getInvoicesController);

// Obtener factura específica por ID
router.get('/:id', getInvoiceByIdController);

// Actualizar factura
router.put('/:id', updateInvoiceController);

// Eliminar factura
router.delete('/:id', deleteInvoiceController);

// Finalizar factura
router.patch('/:id/finalize', finalizeInvoiceController);

// Duplicar factura
router.post('/:id/duplicate', duplicateInvoiceController);

export default router;