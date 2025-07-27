"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchClientsService = exports.deleteClientService = exports.updateClientService = exports.getClientByIdService = exports.getClientsByUser = exports.createClient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createClient = async (userId, data) => {
    const client = await prisma.client.create({
        data: {
            ...data,
            user: { connect: { id: userId } },
        },
    });
    return client;
};
exports.createClient = createClient;
const getClientsByUser = async (userId) => {
    const clients = await prisma.client.findMany({
        where: {
            userId,
        },
    });
    return clients;
};
exports.getClientsByUser = getClientsByUser;
const getClientByIdService = async (userId, clientId) => {
    const client = await prisma.client.findFirst({
        where: {
            id: clientId,
            userId,
        },
    });
    if (!client) {
        throw new Error('Cliente no encontrado');
    }
    return client;
};
exports.getClientByIdService = getClientByIdService;
const updateClientService = async (userId, clientId, data) => {
    const existingClient = await prisma.client.findFirst({
        where: {
            id: clientId,
            userId,
        },
    });
    if (!existingClient) {
        throw new Error('Cliente no encontrado');
    }
    const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data,
    });
    return updatedClient;
};
exports.updateClientService = updateClientService;
const deleteClientService = async (userId, clientId) => {
    const existingClient = await prisma.client.findFirst({
        where: {
            id: clientId,
            userId,
        },
    });
    if (!existingClient) {
        throw new Error('Cliente no encontrado');
    }
    // Verificar si el cliente tiene facturas asociadas
    const invoicesCount = await prisma.invoice.count({
        where: { clientId },
    });
    if (invoicesCount > 0) {
        throw new Error('No se puede eliminar un cliente que tiene facturas asociadas');
    }
    await prisma.client.delete({
        where: { id: clientId },
    });
    return { message: 'Cliente eliminado correctamente' };
};
exports.deleteClientService = deleteClientService;
const searchClientsService = async (userId, searchTerm) => {
    const clients = await prisma.client.findMany({
        where: {
            userId,
            OR: [
                { name: { contains: searchTerm } },
                { rfc: { contains: searchTerm } },
                { email: { contains: searchTerm } },
            ],
        },
    });
    return clients;
};
exports.searchClientsService = searchClientsService;
