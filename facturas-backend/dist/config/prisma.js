"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Nos crea una instancia de prisma
exports.prisma = new client_1.PrismaClient();
