# programacion-3-2025-verri-PipeVerri
## Como correrlo
1. Instalar `docker` y `docker-compose`. Se puede instalar desde pacman
2. Ejecutar `npm i -g turbo pnpm pino-pretty`
3. Ejecutar `pnpm install`en la base del monorepo
4. Ejecutar `pnpm approve-builds` si lo pide
5. Ejecutar `sudo usermod -aG docker $USER` para que turbo pueda acceder a docker
6. Hacer un logout y volverse a logear para que se actualizen los permisos o correr `newgrp docker`
7. Agregar en packages/db un archivo .env que contenga `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trello"`
8. Correr `pnpm init:db` en la carpeta base del proyecto
9. En la carpeta base del proyecto, correr `turbo dev`

## Requisitos del MVP

El objetivo de este proyecto es construir una aplicación web full-stack inspirada en Trello. La aplicación permitirá a los usuarios gestionar tareas a través de un tablero interactivo con columnas y tarjetas.

### Requisitos Funcionales (MVP - Producto Mínimo Viable)

1.  **Tableros:**
    *   El usuario podrá ver un tablero principal.
    *   El tablero contendrá múltiples columnas.

2.  **Columnas (Listas):**
    *   Dentro de un tablero, el usuario podrá ver columnas que representan estados de una tarea (ej: "Por Hacer", "En Progreso", "Hecho").
    *   El usuario podrá crear nuevas columnas.

3.  **Tarjetas (Tareas):**
    *   Dentro de una columna, el usuario podrá ver tarjetas, cada una representando una tarea.
    *   El usuario podrá crear nuevas tarjetas con un título y una descripción.
    *   El usuario podrá mover tarjetas entre columnas mediante una interfaz de "arrastrar y soltar" (drag and drop).

### Requisitos Técnicos

La aplicación se construirá siguiendo una arquitectura moderna de desarrollo web full-stack.

1.  **Backend:**
    *   **Lenguaje:** A elección entre Python o JavaScript/TypeScript.
    *   **Framework:** Se debe utilizar un framework web moderno como FastAPI, Django, Express o NestJS.
    *   **Base de Datos:** Se debe utilizar un ORM (Object-Relational Mapper) como SQLAlchemy, Prisma o TypeORM para interactuar con la base de datos.
    *   **API:** Se debe exponer una API RESTful para que el frontend pueda consumir los datos (CRUD de Tableros, Columnas y Tarjetas).

2.  **Frontend:**
    *   **Framework:** Se debe construir obligatoriamente con **React**.
    *   **Gestión de Estado:** Se utilizarán hooks de React (`useState`, `useEffect`, `useContext`) para gestionar el estado de la aplicación.
    *   **Comunicación con el Backend:** Se realizarán llamadas a la API REST del backend para obtener, crear, actualizar y eliminar datos.
    *   **Interfaz de Usuario:** La interfaz debe ser intuitiva y permitir la funcionalidad de arrastrar y soltar tarjetas.

3.  **Base de Datos:**
    *   A elección, puede ser una base de datos relacional (como PostgreSQL o SQLite) o NoSQL. El modelo de datos debe soportar la relación entre tableros, columnas y tarjetas.

# Documentacion del proyecto
La documentacion se divide en:
- Esta seccion del README donde explico la estructura del proyecto en general, las tecnologias usadas, etc.
- Un package_docs para cada paquete documentando el paquete/parte en si

## Tecnologias usadas
### Proyecto en general
- Turborepo para tener librerias en conjunto
- pnpm como package manager
- Typescript como lenguaje para backend y frontend
### Frontend
- NextJS como framework
  - Para el routing, use el router que viene con NextJS
### Administracion del proyecto
- Linear para crear issues, milestones, etc.
- Los nombres de rama usados fueron los otorgados por linear

## Estructura del proyecto

- En la carpeta packages van a haber codigo comun usado por el backend y frontend(dividio en paquetes)
- En app va a estar todo lo ejecutable
    - En api el backend
    - En web el frontend
