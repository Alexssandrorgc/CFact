"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = exports.registerHandler = void 0;
const auth_schema_1 = require("./auth.schema");
const auth_service_1 = require("./auth.service");
const registerHandler = async (req, res) => {
    try {
        const parseResult = auth_schema_1.registerSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                message: "Datos inválidos",
                errors: parseResult.error.errors,
            });
            return;
        }
        const result = await (0, auth_service_1.registerService)(parseResult.data);
        res.status(201).json({
            message: "Usuario registrado correctamente",
            data: result,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        const statusCode = errorMessage === 'El usuario ya existe' ? 409 : 500;
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.registerHandler = registerHandler;
const loginHandler = async (req, res) => {
    try {
        const parseResult = auth_schema_1.loginSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                message: "Datos inválidos",
                errors: parseResult.error.errors,
            });
            return;
        }
        const result = await (0, auth_service_1.loginService)(parseResult.data);
        res.status(200).json({
            message: "Login exitoso",
            data: result,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        const statusCode = errorMessage === 'Credenciales inválidas' ? 401 : 500;
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.loginHandler = loginHandler;
