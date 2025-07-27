"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginService = exports.registerService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "facturas-secret-key";
const registerService = async (data) => {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error('El usuario ya existe');
    }
    // Hashear contraseña
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    // Crear usuario
    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            name: data.name,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });
    // Generar token
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { user, token };
};
exports.registerService = registerService;
const loginService = async (data) => {
    // Buscar usuario
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new Error('Credenciales inválidas');
    }
    // Verificar contraseña
    const isValidPassword = await bcryptjs_1.default.compare(data.password, user.password);
    if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
    }
    // Generar token
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        },
        token,
    };
};
exports.loginService = loginService;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Token inválido');
    }
};
exports.verifyToken = verifyToken;
