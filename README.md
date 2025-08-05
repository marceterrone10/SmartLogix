# 📦 SmartLogix - Sistema de Soporte en Tiempo Real

SmartLogix es un sistema de gestión de tickets de soporte técnico con roles, autenticación JWT, comunicación en tiempo real por WebSocket (Socket.IO), y documentación Swagger.

---

## 🚀 Tecnologías

* **Node.js** + **Express**
* **MongoDB** + **Mongoose**
* **Socket.IO**
* **JWT** para autenticación
* **Docker** + Redis (pruebas)
* **Joi** para validaciones
* **Swagger** para documentación

---

## 📁 Estructura de carpetas

```
smartlogix/
├── src/
|   ├── config/
|   ├── database/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── sockets/
|   ├── utils/
│   ├── validations/
|   ├── swagger.js
│   └── index.js
├── .env
├── Dockerfile
└── README.md
```

---

## 🔐 Autenticación y roles

* Registro y login con JWT
* Roles disponibles:

  * `admin`
  * `tecnico`
  * `cliente`

---

## 📄 Endpoints REST

Documentados en Swagger: `http://localhost:3000/api-docs`

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Tickets

* `POST /api/tickets` - Crear ticket
* `GET /api/tickets` - Listar todos
* `GET /api/tickets/:id` - Obtener ticket por ID
* `PUT /api/tickets/:id` - Editar estado/asignación
* `PATCH /api/tickets/:id` - Cancelar ticket

---

## 📡 WebSocket Events (Socket.IO)

**Conexión del cliente:**

```js
const socket = io("http://localhost:3000", {
  auth: { token: "JWT_DEL_USUARIO" }
});
```

### Eventos disponibles

| Evento        | Emisor   | Payload                             | Descripción                                 |
| ------------- | -------- | ----------------------------------- | ------------------------------------------- |
| `joinTicket`  | Cliente  | `{ ticketId }`                      | Une al cliente/agente a una sala por ticket |
| `sendMessage` | Cliente  | `{ ticketId, message }`             | Envía un mensaje al ticket                  |
| `message`     | Servidor | `{ from, role, message, timestamp}` | Se dispara cuando llega un mensaje nuevo    |

---

## 🧪 Tests

Pruebas con Jest y Supertest (en proceso):

* Registro y login
* Protección de rutas privadas
* Creación y lectura de tickets

---

## 🐳 Docker

### Dockerfile (solo ejemplo)

```Dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

---

## 🧠 Ideas futuras

* Dashboard en frontend con Vue o React
* Notificaciones en tiempo real
* Buscador y filtros para tickets
* Exportación a PDF o Excel
* Sistema de prioridad y SLA

> No es solo un CRUD. Es una solución real para empresas con soporte técnico en tiempo real.
