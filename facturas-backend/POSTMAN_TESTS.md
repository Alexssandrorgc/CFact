# 🧪 Flujo Completo de Pruebas - Postman

## 📋 Configuración Inicial

**URL Base**: `http://localhost:4000`

### Variables de Entorno en Postman
Crea las siguientes variables en tu entorno de Postman:
- `base_url`: `http://localhost:4000`
- `auth_token`: (se llenará automáticamente después del login)
- `client_id`: (se llenará automáticamente después de crear cliente)
- `invoice_id`: (se llenará automáticamente después de crear factura)

---

## 🔄 Flujo Completo de Pruebas

### **PASO 1: Verificar que la API esté funcionando**

**GET** `{{base_url}}/`

**Headers**: *Ninguno requerido*

**Respuesta esperada:**
```json
{
  "message": "API de facturación funcionando",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/auth",
    "clients": "/clients",
    "invoices": "/invoice"
  }
}
```

---

### **PASO 2: Registro de Usuario**

**POST** `{{base_url}}/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Juan Pérez Freelancer",
  "email": "juan.freelancer@test.com",
  "password": "MiPassword123!"
}
```

**Respuesta esperada:**
```json
{
  "message": "Usuario registrado correctamente",
  "data": {
    "user": {
      "id": 1,
      "email": "juan.freelancer@test.com",
      "name": "Juan Pérez Freelancer",
      "createdAt": "2025-06-29T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Script Post-Response (Tests):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("auth_token", response.data.token);
    console.log("Token guardado:", response.data.token);
}
```

---

### **PASO 3: Login de Usuario (Alternativo)**

**POST** `{{base_url}}/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "juan.freelancer@test.com",
  "password": "MiPassword123!"
}
```

**Script Post-Response (Tests):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("auth_token", response.data.token);
    console.log("Login exitoso, token guardado");
}
```

---

### **PASO 4: Crear Primer Cliente**

**POST** `{{base_url}}/clients`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**
```json
{
  "name": "Empresa ABC S.A. de C.V.",
  "rfc": "ABC123456789",
  "email": "contacto@empresaabc.com",
  "fiscalAddress": "Av. Revolución 123, Col. Centro, Ciudad de México, C.P. 06000"
}
```

**Script Post-Response (Tests):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("client_id", response.data.id);
    console.log("Cliente creado con ID:", response.data.id);
}
```

---

### **PASO 5: Crear Segundo Cliente**

**POST** `{{base_url}}/clients`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**
```json
{
  "name": "Startup Innovadora Tech",
  "rfc": "SIT987654321",
  "email": "ceo@startuptech.com",
  "fiscalAddress": "Calle Tecnología 456, Col. Innovación, Guadalajara, Jalisco, C.P. 44100"
}
```

---

### **PASO 6: Listar Todos los Clientes**

**GET** `{{base_url}}/clients`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Respuesta esperada:**
```json
{
  "message": "Clientes obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "name": "Empresa ABC S.A. de C.V.",
      "rfc": "ABC123456789",
      "email": "contacto@empresaabc.com",
      "fiscalAddress": "Av. Revolución 123...",
      "createdAt": "2025-06-29T..."
    },
    {
      "id": 2,
      "name": "Startup Innovadora Tech",
      "rfc": "SIT987654321",
      ...
    }
  ]
}
```

---

### **PASO 7: Buscar Cliente por Término**

**GET** `{{base_url}}/clients/search?search=ABC`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

---

### **PASO 8: Crear Primera Factura (Sin ISR)**

**POST** `{{base_url}}/invoice`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**
```json
{
  "clientId": {{client_id}},
  "generalDiscount": 0.05,
  "applyIVA": true,
  "applyISR": false,
  "items": [
    {
      "description": "Desarrollo de sitio web corporativo responsivo",
      "quantity": 40,
      "unit": "horas",
      "unitPrice": 500.00,
      "itemDiscount": 0.1
    },
    {
      "description": "Diseño de logotipo y branding",
      "quantity": 15,
      "unit": "horas",
      "unitPrice": 600.00,
      "itemDiscount": 0
    }
  ]
}
```

**Script Post-Response (Tests):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("invoice_id", response.data.id);
    console.log("Factura creada con ID:", response.data.id);
    console.log("Total calculado:", response.data.total);
}
```

---

### **PASO 9: Crear Segunda Factura (Con ISR)**

**POST** `{{base_url}}/invoice`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**
```json
{
  "clientId": 2,
  "generalDiscount": 0,
  "applyIVA": true,
  "applyISR": true,
  "items": [
    {
      "description": "Consultoría en transformación digital",
      "quantity": 25,
      "unit": "horas",
      "unitPrice": 800.00,
      "itemDiscount": 0
    },
    {
      "description": "Implementación de sistema CRM",
      "quantity": 1,
      "unit": "proyecto",
      "unitPrice": 15000.00,
      "itemDiscount": 0.05
    }
  ]
}
```

---

### **PASO 10: Obtener Factura Específica**

**GET** `{{base_url}}/invoice/{{invoice_id}}`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

---

### **PASO 11: Listar Todas las Facturas**

**GET** `{{base_url}}/invoice`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

---

### **PASO 12: Filtrar Facturas por Monto**

**GET** `{{base_url}}/invoice?minTotal=10000&maxTotal=50000`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

---

### **PASO 13: Actualizar Factura (Solo si no está finalizada)**

**PUT** `{{base_url}}/invoice/{{invoice_id}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**
```json
{
  "clientId": {{client_id}},
  "generalDiscount": 0.10,
  "applyIVA": true,
  "applyISR": false,
  "items": [
    {
      "description": "Desarrollo de sitio web corporativo responsivo (ACTUALIZADO)",
      "quantity": 45,
      "unit": "horas",
      "unitPrice": 550.00,
      "itemDiscount": 0.15
    },
    {
      "description": "Diseño de logotipo y branding completo",
      "quantity": 20,
      "unit": "horas",
      "unitPrice": 650.00,
      "itemDiscount": 0
    }
  ]
}
```

---

### **PASO 14: Finalizar Factura**

**PATCH** `{{base_url}}/invoice/{{invoice_id}}/finalize`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

---

### **PASO 15: Intentar Editar Factura Finalizada (Debe Fallar)**

**PUT** `{{base_url}}/invoice/{{invoice_id}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body:** *(Cualquier JSON de factura)*

**Respuesta esperada:** Error 403

---

### **PASO 16: Duplicar Factura Finalizada**

**POST** `{{base_url}}/invoice/{{invoice_id}}/duplicate`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

---

### **PASO 17: Actualizar Cliente**

**PUT** `{{base_url}}/clients/{{client_id}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**
```json
{
  "name": "Empresa ABC S.A. de C.V. (ACTUALIZADA)",
  "rfc": "ABC123456789",
  "email": "nuevo.contacto@empresaabc.com",
  "fiscalAddress": "Nueva Dirección 789, Col. Moderna, Ciudad de México, C.P. 06100"
}
```

---

### **PASO 18: Obtener Cliente Específico**

**GET** `{{base_url}}/clients/{{client_id}}`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

---

### **PASO 19: Probar Autorización (Sin Token) - Debe Fallar**

**GET** `{{base_url}}/clients`

**Headers:** *Ninguno*

**Respuesta esperada:** Error 401

---

### **PASO 20: Probar Token Inválido - Debe Fallar**

**GET** `{{base_url}}/clients`

**Headers:**
```
Authorization: Bearer token-invalido-123
```

**Respuesta esperada:** Error 403

---

## 📊 Resultados Esperados del Flujo Completo

1. ✅ Usuario registrado exitosamente
2. ✅ Login funcional con token JWT
3. ✅ 2 clientes creados
4. ✅ Búsqueda de clientes funcional
5. ✅ 2 facturas creadas con cálculos correctos
6. ✅ Filtros de facturas funcionando
7. ✅ Actualización de factura exitosa
8. ✅ Finalización de factura exitosa
9. ✅ Bloqueo de edición de factura finalizada
10. ✅ Duplicación de factura funcional
11. ✅ Actualización de cliente exitosa
12. ✅ Protección de rutas sin token
13. ✅ Validación de tokens inválidos

## 🎯 Cálculos Esperados

### Factura 1 (PASO 8):
- Item 1: 40h × $500 = $20,000 - 10% desc = $18,000
- Item 2: 15h × $600 = $9,000
- **Subtotal**: $27,000
- **Descuento general (5%)**: $1,350
- **Base para impuestos**: $25,650
- **IVA (16%)**: $4,104
- **Total**: $29,754

### Factura 2 (PASO 9):
- Item 1: 25h × $800 = $20,000
- Item 2: 1 × $15,000 - 5% desc = $14,250
- **Subtotal**: $34,250
- **IVA (16%)**: $5,480
- **ISR (10%)**: $3,425
- **Total**: $36,305

¡Este flujo te permitirá probar todas las funcionalidades del sistema de facturación! 🚀
