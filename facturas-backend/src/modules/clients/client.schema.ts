import { z } from 'zod';

export const createClientSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    rfc: z.string()
        .min(12, 'El RFC debe tener al menos 12 caracteres')
        .max(13, 'El RFC no puede tener más de 13 caracteres'),
    email: z.string().email('Debe ser un correo válido'),
    fiscalAddress: z.string().min(5, 'El domicilio fiscal es obligatorio'),

});