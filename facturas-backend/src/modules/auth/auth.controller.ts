import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.schema";
import { registerService, loginService } from "./auth.service";

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        message: "Datos inválidos",
        errors: parseResult.error.errors,
      });
      return;
    }

    const result = await registerService(parseResult.data);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      data: result,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage === 'El usuario ya existe' ? 409 : 500;
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        message: "Datos inválidos",
        errors: parseResult.error.errors,
      });
      return;
    }

    const result = await loginService(parseResult.data);

    res.status(200).json({
      message: "Login exitoso",
      data: result,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage === 'Credenciales inválidas' ? 401 : 500;
    
    res.status(statusCode).json({
      message: errorMessage,
    });
  }
};
