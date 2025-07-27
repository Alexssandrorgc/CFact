"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_controller_1 = require("./invoice.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Aplicar middleware de autenticación a todas las rutas
router.use(auth_middleware_1.authenticateToken);
// Crear factura
router.post('/', invoice_controller_1.createInvoiceHandler);
// Obtener todas las facturas con filtros
router.get('/', invoice_controller_1.getInvoicesController);
// Obtener factura específica por ID
router.get('/:id', invoice_controller_1.getInvoiceByIdController);
// Actualizar factura
router.put('/:id', invoice_controller_1.updateInvoiceController);
// Eliminar factura
router.delete('/:id', invoice_controller_1.deleteInvoiceController);
// Finalizar factura
router.patch('/:id/finalize', invoice_controller_1.finalizeInvoiceController);
// Duplicar factura
router.post('/:id/duplicate', invoice_controller_1.duplicateInvoiceController);
exports.default = router;
