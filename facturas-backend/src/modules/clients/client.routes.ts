import { Router } from "express";
import { 
  createClientHandler, 
  getClientsHandler,
  getClientByIdHandler,
  updateClientHandler,
  deleteClientHandler,
  searchClientsHandler
} from "./client.controller";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Crear cliente
router.post('/', createClientHandler);

// Obtener todos los clientes
router.get('/', getClientsHandler);

// Buscar clientes
router.get('/search', searchClientsHandler);

// Obtener cliente específico por ID
router.get('/:id', getClientByIdHandler);

// Actualizar cliente
router.put('/:id', updateClientHandler);

// Eliminar cliente
router.delete('/:id', deleteClientHandler);

export default router;