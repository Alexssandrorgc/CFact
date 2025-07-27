"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_routes_1 = __importDefault(require("./modules/clients/client.routes"));
const invoice_routes_1 = __importDefault(require("./modules/invoice/invoice.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_, res) => {
    res.send('API de facturación funcionando');
});
// Rutas públicas
app.use('/auth', auth_routes_1.default);
// Rutas protegidas (agregar middleware de autenticación más tarde)
app.use('/clients', client_routes_1.default);
app.use('/invoice', invoice_routes_1.default);
exports.default = app;
