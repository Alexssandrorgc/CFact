import { Response } from "express";
import { createClientSchema } from "./client.schema";
import { 
  createClient, 
  getClientsByUser,
  getClientByIdService,
  updateClientService,
  deleteClientService,
  searchClientsService
} from "./client.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const createClientHandler = async (req: AuthenticatedRequest, res: Response) => {

    try {
        // Validamos los datos recibidos
        const validateData = createClientSchema.parse(req.body);
        const userId = req.userId!; // Obtenemos el userId del token

        const newClient = await createClient(userId, validateData);

        res.status(201).json({
            message: 'Cliente creado correctamente',
            data: newClient,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error al crear cliente',
            error: error instanceof Error ? error.message : error,
        });
    }
}

export const getClientsHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId!; // Obtenemos el userId del token

        const clients = await getClientsByUser(userId);

        res.status(200).json({
            message: 'Clientes obtenidos correctamente',
            data: clients,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener clientes',
            error: error instanceof Error ? error.message : error,
        });
    }
};

export const getClientByIdHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token
    const clientId = parseInt(req.params!.id);

    if (isNaN(clientId)) {
      res.status(400).json({
        message: "ID de cliente inválido",
      });
      return;
    }

    const client = await getClientByIdService(userId, clientId);

    res.status(200).json({
      message: "Cliente obtenido correctamente",
      data: client,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage === 'Cliente no encontrado' ? 404 : 500;
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};

export const updateClientHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token
    const clientId = parseInt(req.params!.id);

    if (isNaN(clientId)) {
      res.status(400).json({
        message: "ID de cliente inválido",
      });
      return;
    }

    const validateData = createClientSchema.parse(req.body);
    const updatedClient = await updateClientService(userId, clientId, validateData);

    res.status(200).json({
      message: "Cliente actualizado correctamente",
      data: updatedClient,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    let statusCode = 500;
    
    if (errorMessage === 'Cliente no encontrado') {
      statusCode = 404;
    } else if (errorMessage.includes('validación') || errorMessage.includes('inválido')) {
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};

export const deleteClientHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token
    const clientId = parseInt(req.params!.id);

    if (isNaN(clientId)) {
      res.status(400).json({
        message: "ID de cliente inválido",
      });
      return;
    }

    const result = await deleteClientService(userId, clientId);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage = (error as Error).message;
    let statusCode = 500;
    
    if (errorMessage === 'Cliente no encontrado') {
      statusCode = 404;
    } else if (errorMessage.includes('No se puede eliminar')) {
      statusCode = 403;
    }
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};

export const searchClientsHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token
    const searchTerm = req.query!.search as string;

    if (!searchTerm || searchTerm.trim() === '') {
      res.status(400).json({
        message: "Término de búsqueda requerido",
      });
      return;
    }

    const clients = await searchClientsService(userId, searchTerm);

    res.status(200).json({
      message: "Búsqueda completada",
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en la búsqueda",
      error: (error as Error).message,
    });
  }
};