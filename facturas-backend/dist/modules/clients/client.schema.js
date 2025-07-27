"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientSchema = void 0;
const zod_1 = require("zod");
exports.createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'El nombre es obligatorio'),
    rfc: zod_1.z.string()
        .min(12, 'El RFC debe tener al menos 12 caracteres')
        .max(13, 'El RFC no puede tener más de 13 caracteres'),
    email: zod_1.z.string().email('Debe ser un correo válido'),
    fiscalAddress: zod_1.z.string().min(5, 'El domicilio fiscal es obligatorio'),
});
