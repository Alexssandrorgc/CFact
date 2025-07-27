import { Response } from "express";
import { createInvoiceSchema } from "./invoice.schema";
import { 
  createInvoiceService, 
  getInvoicesService,
  getInvoiceByIdService,
  updateInvoiceService,
  deleteInvoiceService,
  finalizeInvoiceService,
  duplicateInvoiceService
} from "./invoice.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const createInvoiceHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token

    const parseResult = createInvoiceSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        message: "Datos inválidos",
        errors: parseResult.error.errors,
      });

      return;
    }

    const invoice = await createInvoiceService(userId, parseResult.data);

    res.status(201).json({
      message: "Factura creada",
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la factura",
      error: (error as Error).message,
    });
  }
};

export const getInvoicesController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token

    // Obtener filtros de query parameters
    const filters = {
      from: req.query!.from as string,
      to: req.query!.to as string,
      clientId: req.query!.clientId ? parseInt(req.query!.clientId as string) : undefined,
      minTotal: req.query!.minTotal ? parseFloat(req.query!.minTotal as string) : undefined,
      maxTotal: req.query!.maxTotal ? parseFloat(req.query!.maxTotal as string) : undefined,
    };

    const invoices = await getInvoicesService(userId, filters);
    
    res.status(200).json({
      message: "Facturas obtenidas correctamente",
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener facturas",
      error: (error as Error).message,
    });
  }
};

export const getInvoiceByIdController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token
    const invoiceId = parseInt(req.params!.id);

    if (isNaN(invoiceId)) {
      res.status(400).json({
        message: "ID de factura inválido",
      });
      return;
    }

    const invoice = await getInvoiceByIdService(userId, invoiceId);

    res.status(200).json({
      message: "Factura obtenida correctamente",
      data: invoice,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage === 'Factura no encontrada' ? 404 : 500;
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};

export const updateInvoiceController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token
    const invoiceId = parseInt(req.params!.id);

    if (isNaN(invoiceId)) {
      res.status(400).json({
        message: "ID de factura inválido",
      });
      return;
    }

    const parseResult = createInvoiceSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        message: "Datos inválidos",
        errors: parseResult.error.errors,
      });
      return;
    }

    const updatedInvoice = await updateInvoiceService(userId, invoiceId, parseResult.data);

    res.status(200).json({
      message: "Factura actualizada correctamente",
      data: updatedInvoice,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    let statusCode = 500;
    
    if (errorMessage === 'Factura no encontrada') {
      statusCode = 404;
    } else if (errorMessage.includes('No se puede editar')) {
      statusCode = 403;
    }
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};

export const deleteInvoiceController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token
    const invoiceId = parseInt(req.params!.id);

    if (isNaN(invoiceId)) {
      res.status(400).json({
        message: "ID de factura inválido",
      });
      return;
    }

    const result = await deleteInvoiceService(userId, invoiceId);

    res.status(200).json(result);
  } catch (error) {
    const errorMessage = (error as Error).message;
    let statusCode = 500;
    
    if (errorMessage === 'Factura no encontrada') {
      statusCode = 404;
    } else if (errorMessage.includes('No se puede eliminar')) {
      statusCode = 403;
    }
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};

export const finalizeInvoiceController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token
    const invoiceId = parseInt(req.params!.id);

    if (isNaN(invoiceId)) {
      res.status(400).json({
        message: "ID de factura inválido",
      });
      return;
    }

    const finalizedInvoice = await finalizeInvoiceService(userId, invoiceId);

    res.status(200).json({
      message: "Factura finalizada correctamente",
      data: finalizedInvoice,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    let statusCode = 500;
    
    if (errorMessage === 'Factura no encontrada') {
      statusCode = 404;
    } else if (errorMessage.includes('ya está finalizada')) {
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};

export const duplicateInvoiceController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId!; // Obtenemos el userId del token
    const invoiceId = parseInt(req.params!.id);

    if (isNaN(invoiceId)) {
      res.status(400).json({
        message: "ID de factura inválido",
      });
      return;
    }

    const duplicatedInvoice = await duplicateInvoiceService(userId, invoiceId);

    res.status(201).json({
      message: "Factura duplicada correctamente",
      data: duplicatedInvoice,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage === 'Factura no encontrada' ? 404 : 500;
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};
