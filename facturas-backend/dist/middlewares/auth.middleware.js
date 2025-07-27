"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_service_1 = require("../modules/auth/auth.service");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({
            message: 'Token de acceso requerido',
        });
        return;
    }
    try {
        const decoded = (0, auth_service_1.verifyToken)(token);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    }
    catch (error) {
        res.status(403).json({
            message: 'Token inválido',
        });
        return;
    }
};
exports.authenticateToken = authenticateToken;
