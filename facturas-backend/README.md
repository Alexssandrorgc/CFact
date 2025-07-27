# API de Facturación para Freelancers

Una API RESTful desarrollada para freelancers que necesitan generar facturas de manera ágil y profesional.

## 🚀 Características

- ✅ **CRUD completo de Clientes**: Crear, leer, actualizar y eliminar clientes
- ✅ **CRUD completo de Facturas**: Crear, leer, actualizar y eliminar facturas
- ✅ **Autenticación JWT**: Sistema de registro y login seguro
- ✅ **Cálculos automáticos**: IVA (16%) e ISR (10%) aplicables
- ✅ **Filtros avanzados**: Búsqueda por fecha, cliente, monto
- ✅ **Estados de factura**: Borrador, finalizada, enviada
- ✅ **Descuentos flexibles**: Por item y general
- ✅ **Duplicación de facturas**: Para correcciones

## 🛠️ Tecnologías

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM para base de datos
- **MySQL** - Base de datos
- **Zod** - Validación de esquemas
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas

## 📦 Instalación

1. Clona el repositorio
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   ```env
   DATABASE_URL="mysql://usuario:password@localhost:3306/facturas_db"
   JWT_SECRET="tu-secreto-jwt"
   ```
4. Ejecuta las migraciones:
   ```bash
   npm run db:migrate
   ```
5. (Opcional) Ejecuta el seed para datos de prueba:
   ```bash
   npm run db:seed
   ```
6. Inicia el servidor:
   ```bash
   npm run dev
   ```

## � Datos de Prueba

Si ejecutaste el seed, puedes usar estas credenciales para probar:
- **Email**: `freelancer@test.com`
- **Password**: `password123`

## �📚 Documentación de la API

### 🔐 Autenticación

Todas las rutas excepto `/auth/*` requieren autenticación mediante JWT token en el header:
```
Authorization: Bearer {tu-jwt-token}
```

#### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

#### Login de Usuario
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### 👥 Clientes

#### Crear Cliente
```http
POST /clients
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Empresa ABC",
  "rfc": "ABC123456XYZ",
  "email": "contacto@empresa.com",
  "fiscalAddress": "Calle Principal 123, Ciudad"
}
```

#### Obtener Todos los Clientes
```http
GET /clients
Authorization: Bearer {token}
```

#### Obtener Cliente por ID
```http
GET /clients/{id}
Authorization: Bearer {token}
```

#### Buscar Clientes
```http
GET /clients/search?search={término}
Authorization: Bearer {token}
```

#### Actualizar Cliente
```http
PUT /clients/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Empresa ABC Actualizada",
  "rfc": "ABC123456XYZ",
  "email": "nuevo@empresa.com",
  "fiscalAddress": "Nueva Dirección 456"
}
```

#### Eliminar Cliente
```http
DELETE /clients/{id}
Authorization: Bearer {token}
```

### 🧾 Facturas

#### Crear Factura
```http
POST /invoice
Authorization: Bearer {token}
Content-Type: application/json

{
  "clientId": 1,
  "generalDiscount": 0.05,
  "applyIVA": true,
  "applyISR": false,
  "items": [
    {
      "description": "Desarrollo de sitio web",
      "quantity": 40,
      "unit": "horas",
      "unitPrice": 500,
      "itemDiscount": 0.1
    }
  ]
}
```

#### Obtener Todas las Facturas (con filtros)
```http
GET /invoice?from=2023-01-01&to=2023-12-31&clientId=1&minTotal=1000&maxTotal=5000
Authorization: Bearer {token}
```

#### Obtener Factura por ID
```http
GET /invoice/{id}
Authorization: Bearer {token}
```

#### Actualizar Factura
```http
PUT /invoice/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "clientId": 1,
  "generalDiscount": 0.1,
  "applyIVA": true,
  "applyISR": true,
  "items": [
    {
      "description": "Desarrollo y mantenimiento",
      "quantity": 50,
      "unit": "horas",
      "unitPrice": 600,
      "itemDiscount": 0.05
    }
  ]
}
```

#### Finalizar Factura
```http
PATCH /invoice/{id}/finalize
Authorization: Bearer {token}
```

#### Duplicar Factura
```http
POST /invoice/{id}/duplicate
Authorization: Bearer {token}
```

#### Eliminar Factura
```http
DELETE /invoice/{id}
Authorization: Bearer {token}
```

## 🗄️ Estructura de Base de Datos

### User
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- createdAt

### Client
- id (Primary Key)
- userId (Foreign Key)
- name
- rfc
- email
- fiscalAddress
- createdAt

### Invoice
- id (Primary Key)
- userId (Foreign Key)
- clientId (Foreign Key)
- createdAt
- finalized (Boolean)
- sent (Boolean)
- generalDiscount (Decimal)
- subtotal (Decimal)
- iva (Decimal)
- isr (Decimal)
- total (Decimal)

### InvoiceItem
- id (Primary Key)
- invoiceId (Foreign Key)
- description
- quantity (Decimal)
- unit
- unitPrice (Decimal)
- itemDiscount (Decimal)
- subtotal (Decimal)

## 🔧 Próximas Características

- [ ] Generación de PDF de facturas
- [ ] Envío de facturas por email
- [ ] Dashboard con estadísticas
- [ ] Configuración de impuestos personalizable
- [ ] Plantillas de factura personalizables
- [ ] Exportación a Excel/CSV
- [ ] Notificaciones automáticas
- [ ] Multi-tenancy mejorado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
