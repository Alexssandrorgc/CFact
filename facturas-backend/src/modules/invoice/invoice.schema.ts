import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Descripción requerida'),
  quantity: z.number().positive('La cantidad debe ser mayor a cero'),
  unit: z.string().min(1, 'Unidad requerida'),
  unitPrice: z.number().nonnegative('El precio unitario no puede ser negativo'),
  itemDiscount: z.number().min(0).max(1).optional(),
});

export const createInvoiceSchema = z.object({
  clientId: z.number().positive(),
  generalDiscount: z.number().min(0).max(1).optional(),
  applyIVA: z.boolean().optional(),
  applyISR: z.boolean().optional(),
  items: z.array(invoiceItemSchema).min(1, 'Debe haber al menos un item'),
});

export const updateInvoiceSchema = createInvoiceSchema;

export const invoiceFiltersSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  clientId: z.coerce.number().optional(),
  minTotal: z.coerce.number().optional(),
  maxTotal: z.coerce.number().optional(),
}).optional();

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type InvoiceFiltersInput = z.infer<typeof invoiceFiltersSchema>;
