"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateInvoiceController = exports.finalizeInvoiceController = exports.deleteInvoiceController = exports.updateInvoiceController = exports.getInvoiceByIdController = exports.getInvoicesController = exports.createInvoiceHandler = void 0;
const invoice_schema_1 = require("./invoice.schema");
const invoice_service_1 = require("./invoice.service");
const createInvoiceHandler = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const parseResult = invoice_schema_1.createInvoiceSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                message: "Datos inválidos",
                errors: parseResult.error.errors,
            });
            return;
        }
        const invoice = await (0, invoice_service_1.createInvoiceService)(userId, parseResult.data);
        res.status(201).json({
            message: "Factura creada",
            data: invoice,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al crear la factura",
            error: error.message,
        });
    }
};
exports.createInvoiceHandler = createInvoiceHandler;
const getInvoicesController = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        // Obtener filtros de query parameters
        const filters = {
            from: req.query.from,
            to: req.query.to,
            clientId: req.query.clientId ? parseInt(req.query.clientId) : undefined,
            minTotal: req.query.minTotal ? parseFloat(req.query.minTotal) : undefined,
            maxTotal: req.query.maxTotal ? parseFloat(req.query.maxTotal) : undefined,
        };
        const invoices = await (0, invoice_service_1.getInvoicesService)(userId, filters);
        res.status(200).json({
            message: "Facturas obtenidas correctamente",
            data: invoices,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener facturas",
            error: error.message,
        });
    }
};
exports.getInvoicesController = getInvoicesController;
const getInvoiceByIdController = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const invoiceId = parseInt(req.params.id);
        if (isNaN(invoiceId)) {
            res.status(400).json({
                message: "ID de factura inválido",
            });
            return;
        }
        const invoice = await (0, invoice_service_1.getInvoiceByIdService)(userId, invoiceId);
        res.status(200).json({
            message: "Factura obtenida correctamente",
            data: invoice,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        const statusCode = errorMessage === 'Factura no encontrada' ? 404 : 500;
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.getInvoiceByIdController = getInvoiceByIdController;
const updateInvoiceController = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const invoiceId = parseInt(req.params.id);
        if (isNaN(invoiceId)) {
            res.status(400).json({
                message: "ID de factura inválido",
            });
            return;
        }
        const parseResult = invoice_schema_1.createInvoiceSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                message: "Datos inválidos",
                errors: parseResult.error.errors,
            });
            return;
        }
        const updatedInvoice = await (0, invoice_service_1.updateInvoiceService)(userId, invoiceId, parseResult.data);
        res.status(200).json({
            message: "Factura actualizada correctamente",
            data: updatedInvoice,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        let statusCode = 500;
        if (errorMessage === 'Factura no encontrada') {
            statusCode = 404;
        }
        else if (errorMessage.includes('No se puede editar')) {
            statusCode = 403;
        }
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.updateInvoiceController = updateInvoiceController;
const deleteInvoiceController = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const invoiceId = parseInt(req.params.id);
        if (isNaN(invoiceId)) {
            res.status(400).json({
                message: "ID de factura inválido",
            });
            return;
        }
        const result = await (0, invoice_service_1.deleteInvoiceService)(userId, invoiceId);
        res.status(200).json(result);
    }
    catch (error) {
        const errorMessage = error.message;
        let statusCode = 500;
        if (errorMessage === 'Factura no encontrada') {
            statusCode = 404;
        }
        else if (errorMessage.includes('No se puede eliminar')) {
            statusCode = 403;
        }
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.deleteInvoiceController = deleteInvoiceController;
const finalizeInvoiceController = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const invoiceId = parseInt(req.params.id);
        if (isNaN(invoiceId)) {
            res.status(400).json({
                message: "ID de factura inválido",
            });
            return;
        }
        const finalizedInvoice = await (0, invoice_service_1.finalizeInvoiceService)(userId, invoiceId);
        res.status(200).json({
            message: "Factura finalizada correctamente",
            data: finalizedInvoice,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        let statusCode = 500;
        if (errorMessage === 'Factura no encontrada') {
            statusCode = 404;
        }
        else if (errorMessage.includes('ya está finalizada')) {
            statusCode = 400;
        }
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.finalizeInvoiceController = finalizeInvoiceController;
const duplicateInvoiceController = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const invoiceId = parseInt(req.params.id);
        if (isNaN(invoiceId)) {
            res.status(400).json({
                message: "ID de factura inválido",
            });
            return;
        }
        const duplicatedInvoice = await (0, invoice_service_1.duplicateInvoiceService)(userId, invoiceId);
        res.status(201).json({
            message: "Factura duplicada correctamente",
            data: duplicatedInvoice,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        const statusCode = errorMessage === 'Factura no encontrada' ? 404 : 500;
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.duplicateInvoiceController = duplicateInvoiceController;
