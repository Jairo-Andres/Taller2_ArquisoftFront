# Frontend - Sistema de Gestión de Reservas para Eventos

Este es el frontend de un sistema de gestión de reservas para eventos. Está construido con Next.js y React.

## Requisitos previos
Asegúrate de tener instalados los siguientes programas:

  -Node.js (v14 o superior)
  -npm (v6 o superior)

## Configuración inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jairo-Andres/frontend-eventos.git
cd frontend-eventos

```
### 2.  Instalar dependencias
```bash
npm install
```
### 3. Configuración del archivo .env
  1. Crea un archivo .env.local en la raíz del proyecto.
  ```bash
  touch .env.local
  ```
  2. Añade las siguientes variables de entorno:
  ```bash
  NEXT_PUBLIC_API_URL=http://localhost:3001/wsdl
  ```
### 4. Ejecutar el servidor de desarrollo
 -Inicia el servidor frontend en modo desarrollo::
   ```bash
  npm run dev
  ```
El frontend estará disponible en http://localhost:3000.

## Estructura del proyecto
- pages/: Contiene las páginas del proyecto.
- components/: Componentes reutilizables dentro del frontend.
- styles/: Archivos CSS y globales.
- public/: Archivos estáticos (imágenes, iconos, etc.).

## Uso
El frontend permite a los usuarios interactuar con la API del backend (SOAP) para:

- Crear, editar y eliminar eventos.
- Gestionar reservas.
- Ver el listado de personas registradas en los eventos y editarlas.

