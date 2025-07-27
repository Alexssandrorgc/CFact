"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceFiltersSchema = exports.updateInvoiceSchema = exports.createInvoiceSchema = void 0;
const zod_1 = require("zod");
const invoiceItemSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, 'Descripción requerida'),
    quantity: zod_1.z.number().positive('La cantidad debe ser mayor a cero'),
    unit: zod_1.z.string().min(1, 'Unidad requerida'),
    unitPrice: zod_1.z.number().nonnegative('El precio unitario no puede ser negativo'),
    itemDiscount: zod_1.z.number().min(0).max(1).optional(),
});
exports.createInvoiceSchema = zod_1.z.object({
    clientId: zod_1.z.number().positive(),
    generalDiscount: zod_1.z.number().min(0).max(1).optional(),
    applyIVA: zod_1.z.boolean().optional(),
    applyISR: zod_1.z.boolean().optional(),
    items: zod_1.z.array(invoiceItemSchema).min(1, 'Debe haber al menos un item'),
});
exports.updateInvoiceSchema = exports.createInvoiceSchema;
exports.invoiceFiltersSchema = zod_1.z.object({
    from: zod_1.z.string().optional(),
    to: zod_1.z.string().optional(),
    clientId: zod_1.z.coerce.number().optional(),
    minTotal: zod_1.z.coerce.number().optional(),
    maxTotal: zod_1.z.coerce.number().optional(),
}).optional();
