import express from 'express';
import cors from 'cors';
import clientRoutes from './modules/clients/client.routes';
import invoiceRoutes from './modules/invoice/invoice.routes';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
    res.json({
        message: 'API de facturación funcionando',
        version: '1.0.0',
        endpoints: {
            auth: '/auth',
            clients: '/clients',
            invoices: '/invoice'
        }
    });
});

// Rutas públicas
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/clients', clientRoutes);
app.use('/invoice', invoiceRoutes);

// Middleware para rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;