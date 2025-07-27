# Pruebas de la API de Facturación

## 1. Registro de Usuario
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Respuesta esperada:
```json
{
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "Test User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 3. Crear Cliente (requiere token)
```bash
curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {tu-token}" \
  -d '{
    "name": "Empresa XYZ",
    "rfc": "XYZ123456789",
    "email": "contacto@empresa.com",
    "fiscalAddress": "Calle Principal 123"
  }'
```

## 4. Listar Clientes
```bash
curl -X GET http://localhost:3000/clients \
  -H "Authorization: Bearer {tu-token}"
```

## 5. Crear Factura
```bash
curl -X POST http://localhost:3000/invoice \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {tu-token}" \
  -d '{
    "clientId": 1,
    "generalDiscount": 0.05,
    "applyIVA": true,
    "applyISR": false,
    "items": [
      {
        "description": "Desarrollo web",
        "quantity": 40,
        "unit": "horas",
        "unitPrice": 500,
        "itemDiscount": 0.1
      }
    ]
  }'
```

## 6. Listar Facturas con Filtros
```bash
curl -X GET "http://localhost:3000/invoice?from=2023-01-01&to=2023-12-31&minTotal=1000" \
  -H "Authorization: Bearer {tu-token}"
```

## 7. Finalizar Factura
```bash
curl -X PATCH http://localhost:3000/invoice/1/finalize \
  -H "Authorization: Bearer {tu-token}"
```

## 8. Duplicar Factura
```bash
curl -X POST http://localhost:3000/invoice/1/duplicate \
  -H "Authorization: Bearer {tu-token}"
```

## Códigos de Respuesta

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Datos inválidos
- **401**: Token requerido
- **403**: Token inválido o acción no permitida
- **404**: Recurso no encontrado
- **409**: Conflicto (ej: usuario ya existe)
- **500**: Error interno del servidor
