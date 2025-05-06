# Backend - Venta de Celulares 📱

Este backend fue desarrollado con **Node.js**, y utiliza una **base de datos NoSQL** (como MongoDB o Firestore) para manejar la información de un negocio dedicado a la **venta de celulares**.

## 🎯 Objetivo del proyecto

Permitir la gestión completa de:
- Inventario de celulares
- Clientes
- Ventas
- Marcas
- Proveedores
- Categorías

Todo se maneja mediante rutas API REST sin autenticación (públicas), ideales para comenzar el desarrollo o pruebas locales.

---

## 📦 Estructura de rutas del backend (CRUD)

Cada ruta representa una **colección** o documento raíz distinto en la base de datos.

### 1. `/celulares`
Gestión del inventario de celulares.
- `GET /celulares` – Listar todos los celulares.
- `GET /celulares/:id` – Ver celular específico.
- `POST /celulares` – Crear nuevo celular.
- `PUT /celulares/:id` – Editar celular.
- `DELETE /celulares/:id` – Eliminar celular.

### 2. `/ventas`
Registro de ventas realizadas.
- `GET /ventas` – Ver todas las ventas.
- `GET /ventas/:id` – Detalle de una venta.
- `POST /ventas` – Registrar nueva venta.
- `PUT /ventas/:id` – Editar venta.
- `DELETE /ventas/:id` – Eliminar venta.

### 3. `/clientes`
Manejo de clientes frecuentes.
- `GET /clientes` – Ver todos los clientes.
- `GET /clientes/:id` – Cliente específico.
- `POST /clientes` – Crear cliente.
- `PUT /clientes/:id` – Editar cliente.
- `DELETE /clientes/:id` – Eliminar cliente.

### 4. `/marcas`
Catálogo de marcas de celulares.
- `GET /marcas`
- `GET /marcas/:id`
- `POST /marcas`
- `PUT /marcas/:id`
- `DELETE /marcas/:id`

### 5. `/proveedores`
Listado de proveedores del negocio.
- `GET /proveedores`
- `GET /proveedores/:id`
- `POST /proveedores`
- `PUT /proveedores/:id`
- `DELETE /proveedores/:id`

### 6. `/categorias`
Clasificación de celulares (gama alta, media, etc).
- `GET /categorias`
- `GET /categorias/:id`
- `POST /categorias`
- `PUT /categorias/:id`
- `DELETE /categorias/:id`

---

## 🧩 Integración con frontend

Estas rutas son consumidas desde la aplicación frontend desarrollada en ReactJS, la cual permite realizar operaciones CRUD desde la interfaz gráfica de forma sencilla.
