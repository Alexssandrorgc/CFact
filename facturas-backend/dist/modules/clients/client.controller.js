"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchClientsHandler = exports.deleteClientHandler = exports.updateClientHandler = exports.getClientByIdHandler = exports.getClientsHandler = exports.createClientHandler = void 0;
const client_schema_1 = require("./client.schema");
const client_service_1 = require("./client.service");
const createClientHandler = async (req, res) => {
    try {
        // Validamos los datos recibidos
        const validateData = client_schema_1.createClientSchema.parse(req.body);
        const userId = req.userId; // Obtenemos el userId del token
        const newClient = await (0, client_service_1.createClient)(userId, validateData);
        res.status(201).json({
            message: 'Cliente creado correctamente',
            data: newClient,
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Error al crear cliente',
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.createClientHandler = createClientHandler;
const getClientsHandler = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const clients = await (0, client_service_1.getClientsByUser)(userId);
        res.status(200).json({
            message: 'Clientes obtenidos correctamente',
            data: clients,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error al obtener clientes',
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.getClientsHandler = getClientsHandler;
const getClientByIdHandler = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const clientId = parseInt(req.params.id);
        if (isNaN(clientId)) {
            res.status(400).json({
                message: "ID de cliente inválido",
            });
            return;
        }
        const client = await (0, client_service_1.getClientByIdService)(userId, clientId);
        res.status(200).json({
            message: "Cliente obtenido correctamente",
            data: client,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        const statusCode = errorMessage === 'Cliente no encontrado' ? 404 : 500;
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.getClientByIdHandler = getClientByIdHandler;
const updateClientHandler = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const clientId = parseInt(req.params.id);
        if (isNaN(clientId)) {
            res.status(400).json({
                message: "ID de cliente inválido",
            });
            return;
        }
        const validateData = client_schema_1.createClientSchema.parse(req.body);
        const updatedClient = await (0, client_service_1.updateClientService)(userId, clientId, validateData);
        res.status(200).json({
            message: "Cliente actualizado correctamente",
            data: updatedClient,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        let statusCode = 500;
        if (errorMessage === 'Cliente no encontrado') {
            statusCode = 404;
        }
        else if (errorMessage.includes('validación') || errorMessage.includes('inválido')) {
            statusCode = 400;
        }
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.updateClientHandler = updateClientHandler;
const deleteClientHandler = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const clientId = parseInt(req.params.id);
        if (isNaN(clientId)) {
            res.status(400).json({
                message: "ID de cliente inválido",
            });
            return;
        }
        const result = await (0, client_service_1.deleteClientService)(userId, clientId);
        res.status(200).json(result);
    }
    catch (error) {
        const errorMessage = error.message;
        let statusCode = 500;
        if (errorMessage === 'Cliente no encontrado') {
            statusCode = 404;
        }
        else if (errorMessage.includes('No se puede eliminar')) {
            statusCode = 403;
        }
        res.status(statusCode).json({
            message: errorMessage,
        });
    }
};
exports.deleteClientHandler = deleteClientHandler;
const searchClientsHandler = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el userId del token
        const searchTerm = req.query.search;
        if (!searchTerm || searchTerm.trim() === '') {
            res.status(400).json({
                message: "Término de búsqueda requerido",
            });
            return;
        }
        const clients = await (0, client_service_1.searchClientsService)(userId, searchTerm);
        res.status(200).json({
            message: "Búsqueda completada",
            data: clients,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error en la búsqueda",
            error: error.message,
        });
    }
};
exports.searchClientsHandler = searchClientsHandler;
