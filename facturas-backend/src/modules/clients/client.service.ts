import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClient = async (
  userId: number,
  data: {
    name: string;
    rfc: string;
    email: string;
    fiscalAddress: string;
  }
) => {
  const client = await prisma.client.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });

  return client;
};

export const getClientsByUser = async (userId: number) => {
  const clients = await prisma.client.findMany({
    where: {
      userId,
    },
  });

  return clients;
};

export const getClientByIdService = async (userId: number, clientId: number) => {
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

export const updateClientService = async (
  userId: number,
  clientId: number,
  data: {
    name: string;
    rfc: string;
    email: string;
    fiscalAddress: string;
  }
) => {
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

export const deleteClientService = async (userId: number, clientId: number) => {
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

export const searchClientsService = async (userId: number, searchTerm: string) => {
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
