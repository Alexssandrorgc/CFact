"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = require("./client.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Aplicar middleware de autenticación a todas las rutas
router.use(auth_middleware_1.authenticateToken);
// Crear cliente
router.post('/', client_controller_1.createClientHandler);
// Obtener todos los clientes
router.get('/', client_controller_1.getClientsHandler);
// Buscar clientes
router.get('/search', client_controller_1.searchClientsHandler);
// Obtener cliente específico por ID
router.get('/:id', client_controller_1.getClientByIdHandler);
// Actualizar cliente
router.put('/:id', client_controller_1.updateClientHandler);
// Eliminar cliente
router.delete('/:id', client_controller_1.deleteClientHandler);
exports.default = router;
