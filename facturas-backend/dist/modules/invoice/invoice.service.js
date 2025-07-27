"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateInvoiceService = exports.finalizeInvoiceService = exports.deleteInvoiceService = exports.updateInvoiceService = exports.getInvoiceByIdService = exports.getInvoicesService = exports.createInvoiceService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createInvoiceService = async (userId, data) => {
    const applyIVA = data.applyIVA ?? true;
    const applyISR = data.applyISR ?? false;
    const ivaRate = 0.16;
    const isrRate = 0.10;
    // Calcular subtotales de cada item
    const items = data.items.map((item) => {
        const base = item.quantity * item.unitPrice;
        const discount = item.itemDiscount ? base * item.itemDiscount : 0;
        const subtotal = base - discount;
        return { ...item, subtotal };
    });
    const subtotalGlobal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const descuentoGeneral = data.generalDiscount
        ? subtotalGlobal * data.generalDiscount
        : 0;
    const subtotalConDescuento = subtotalGlobal - descuentoGeneral;
    const iva = applyIVA ? subtotalConDescuento * ivaRate : 0;
    const isr = applyISR ? subtotalConDescuento * isrRate : 0;
    const total = subtotalConDescuento + iva - isr;
    const invoice = await prisma.invoice.create({
        data: {
            userId,
            clientId: data.clientId,
            generalDiscount: data.generalDiscount,
            subtotal: subtotalGlobal,
            iva,
            isr,
            total,
            items: {
                create: items.map((item) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unit: item.unit,
                    unitPrice: item.unitPrice,
                    itemDiscount: item.itemDiscount,
                    subtotal: item.subtotal,
                })),
            },
        },
        include: { items: true },
    });
    return invoice;
};
exports.createInvoiceService = createInvoiceService;
const getInvoicesService = async (userId, filters = {}) => {
    const { from, to, clientId, minTotal, maxTotal } = filters;
    const where = {
        userId,
    };
    if (clientId)
        where.clientId = clientId;
    if (from && to) {
        where.createdAt = {
            gte: new Date(from),
            lte: new Date(to),
        };
    }
    else if (from) {
        where.createdAt = {
            gte: new Date(from),
        };
    }
    else if (to) {
        where.createdAt = {
            lte: new Date(to),
        };
    }
    if (minTotal !== undefined || maxTotal !== undefined) {
        where.total = {};
        if (minTotal !== undefined)
            where.total.gte = minTotal;
        if (maxTotal !== undefined)
            where.total.lte = maxTotal;
    }
    const invoices = await prisma.invoice.findMany({
        where,
        include: {
            client: true,
            items: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return invoices;
};
exports.getInvoicesService = getInvoicesService;
const getInvoiceByIdService = async (userId, invoiceId) => {
    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            userId,
        },
        include: {
            client: true,
            items: true,
        },
    });
    if (!invoice) {
        throw new Error('Factura no encontrada');
    }
    return invoice;
};
exports.getInvoiceByIdService = getInvoiceByIdService;
const updateInvoiceService = async (userId, invoiceId, data) => {
    // Verificar que la factura existe y pertenece al usuario
    const existingInvoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            userId,
        },
    });
    if (!existingInvoice) {
        throw new Error('Factura no encontrada');
    }
    // No permitir editar facturas finalizadas o enviadas
    if (existingInvoice.finalized || existingInvoice.sent) {
        throw new Error('No se puede editar una factura finalizada o enviada');
    }
    const applyIVA = data.applyIVA ?? true;
    const applyISR = data.applyISR ?? false;
    const ivaRate = 0.16;
    const isrRate = 0.10;
    // Calcular subtotales de cada item
    const items = data.items.map((item) => {
        const base = item.quantity * item.unitPrice;
        const discount = item.itemDiscount ? base * item.itemDiscount : 0;
        const subtotal = base - discount;
        return { ...item, subtotal };
    });
    const subtotalGlobal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const descuentoGeneral = data.generalDiscount
        ? subtotalGlobal * data.generalDiscount
        : 0;
    const subtotalConDescuento = subtotalGlobal - descuentoGeneral;
    const iva = applyIVA ? subtotalConDescuento * ivaRate : 0;
    const isr = applyISR ? subtotalConDescuento * isrRate : 0;
    const total = subtotalConDescuento + iva - isr;
    // Actualizar la factura usando una transacción
    const updatedInvoice = await prisma.$transaction(async (prisma) => {
        // Eliminar items existentes
        await prisma.invoiceItem.deleteMany({
            where: { invoiceId },
        });
        // Actualizar la factura
        return await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                clientId: data.clientId,
                generalDiscount: data.generalDiscount,
                subtotal: subtotalGlobal,
                iva,
                isr,
                total,
                items: {
                    create: items.map((item) => ({
                        description: item.description,
                        quantity: item.quantity,
                        unit: item.unit,
                        unitPrice: item.unitPrice,
                        itemDiscount: item.itemDiscount,
                        subtotal: item.subtotal,
                    })),
                },
            },
            include: { items: true, client: true },
        });
    });
    return updatedInvoice;
};
exports.updateInvoiceService = updateInvoiceService;
const deleteInvoiceService = async (userId, invoiceId) => {
    // Verificar que la factura existe y pertenece al usuario
    const existingInvoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            userId,
        },
    });
    if (!existingInvoice) {
        throw new Error('Factura no encontrada');
    }
    // No permitir eliminar facturas finalizadas o enviadas
    if (existingInvoice.finalized || existingInvoice.sent) {
        throw new Error('No se puede eliminar una factura finalizada o enviada');
    }
    await prisma.invoice.delete({
        where: { id: invoiceId },
    });
    return { message: 'Factura eliminada correctamente' };
};
exports.deleteInvoiceService = deleteInvoiceService;
const finalizeInvoiceService = async (userId, invoiceId) => {
    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            userId,
        },
    });
    if (!invoice) {
        throw new Error('Factura no encontrada');
    }
    if (invoice.finalized) {
        throw new Error('La factura ya está finalizada');
    }
    const finalizedInvoice = await prisma.invoice.update({
        where: { id: invoiceId },
        data: { finalized: true },
        include: { items: true, client: true },
    });
    return finalizedInvoice;
};
exports.finalizeInvoiceService = finalizeInvoiceService;
const duplicateInvoiceService = async (userId, invoiceId) => {
    const originalInvoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            userId,
        },
        include: { items: true },
    });
    if (!originalInvoice) {
        throw new Error('Factura no encontrada');
    }
    const duplicatedInvoice = await prisma.invoice.create({
        data: {
            userId,
            clientId: originalInvoice.clientId,
            generalDiscount: originalInvoice.generalDiscount,
            subtotal: originalInvoice.subtotal,
            iva: originalInvoice.iva,
            isr: originalInvoice.isr,
            total: originalInvoice.total,
            items: {
                create: originalInvoice.items.map((item) => ({
                    description: item.description,
                    quantity: item.quantity,
                    unit: item.unit,
                    unitPrice: item.unitPrice,
                    itemDiscount: item.itemDiscount,
                    subtotal: item.subtotal,
                })),
            },
        },
        include: { items: true, client: true },
    });
    return duplicatedInvoice;
};
exports.duplicateInvoiceService = duplicateInvoiceService;
