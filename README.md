# UniLib - Biblioteca Universitaria

UniLib es una aplicación web de biblioteca universitaria donde los usuarios pueden buscar libros, ver información sobre ellos, realizar préstamos, guardar libros en su lista de deseos y llevar un registro de su lectura.

Este proyecto fue desarrollado como proyecto final del curso de Desarrollo Web en Jala University.

**Demo en vivo:** Agregar enlace de Netlify o Vercel.

**Repositorio:** Agregar enlace de GitHub.

## Funcionalidades

- Buscar libros por título, autor o palabra clave usando la API pública de Open Library.
- Filtrar libros por género, como ficción, ciencia e historia.
- Ver los detalles de cada libro, incluyendo su portada, autor y descripción.
- Realizar préstamos de libros por 14 días, revisar las fechas de vencimiento y devolverlos.
- Llevar un registro de lectura: Por leer, Leyendo y Completado.
- Guardar libros en una lista de deseos.
- Registrarse e iniciar sesión mediante un sistema simulado.
- Cambiar entre tema claro y oscuro.
- Guardar los datos en el navegador usando `localStorage`.
- Usar la aplicación desde computadoras, tablets y celulares.
- Navegar por la aplicación con el teclado y utilizar herramientas de accesibilidad.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| TypeScript | Lenguaje de programación |
| React 19 | Crear la interfaz de la aplicación |
| Vite | Ejecutar y compilar el proyecto |
| React Router DOM | Navegar entre las páginas |
| Context API y useReducer | Manejar el estado de la aplicación |
| Open Library API | Obtener información de los libros |
| lucide-react | Mostrar íconos |
| Vitest y React Testing Library | Realizar pruebas |
| Netlify o Vercel | Publicar la aplicación |

## Cómo ejecutar el proyecto

### Requisitos

- Node.js versión 20 o superior.
- npm.

### Instalación

1. Clonar el repositorio:

   ```bash
   git clone <URL-DEL-REPOSITORIO>
   ```

2. Entrar a la carpeta del proyecto:

   ```bash
   cd unilib
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en el navegador la dirección que aparece en la terminal. Normalmente es `http://localhost:5173`.

No es necesario configurar claves de API, ya que Open Library ofrece una API pública.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Permite probar la versión compilada |
| `npm run lint` | Revisa el código para encontrar posibles problemas |
| `npm test` | Ejecuta las pruebas |

## Pruebas

El proyecto incluye pruebas para comprobar el funcionamiento de:

- Las funciones de validación y seguridad.
- El hook `useFetch`, tanto cuando las solicitudes funcionan como cuando ocurren errores.
- Los formularios de inicio de sesión y registro.

Para ejecutar las pruebas, usar el siguiente comando:

```bash
npm test
```

## Estructura del proyecto

```text
src/
├── components/   Componentes reutilizables
├── context/      Manejo del estado global
├── hooks/        Hooks personalizados
├── layouts/      Estructura principal de las páginas
├── pages/        Páginas de la aplicación
├── services/     Solicitudes a la API
├── types/        Tipos de TypeScript
├── utils/        Funciones auxiliares y validaciones
└── test/         Configuración de las pruebas
```

## Decisiones técnicas

- **Context API y useReducer:** Se utilizan para organizar y manejar los préstamos y los estados de lectura de los libros.
- **Carga diferida:** Las páginas y las imágenes se cargan cuando son necesarias para mejorar el rendimiento.
- **memo, useMemo y useCallback:** Se utilizan para evitar renderizados innecesarios en el catálogo.
- **Hook useFetch:** Permite realizar solicitudes a la API y ayuda a evitar que resultados de búsquedas anteriores reemplacen los más recientes.
- **Validación de datos:** Se revisan los datos ingresados por los usuarios y los identificadores de los libros antes de procesarlos.
- **Seguridad en el cliente:** Se incluyen validaciones, limpieza de texto, redirecciones seguras después del inicio de sesión y hash de contraseñas con SHA-256 y sal.

## Limitaciones conocidas

- La aplicación no tiene un backend propio. Los datos de los usuarios, préstamos y listas se guardan en `localStorage`.
- Los datos se almacenan en el navegador, por lo que no se comparten automáticamente entre dispositivos.
- El registro y el inicio de sesión son simulados. Para una aplicación real, sería necesario implementar un backend y un sistema de autenticación adecuado.
- Todavía no se han implementado las reservas de libros ni las notificaciones sobre su disponibilidad.

## Autora

**Fabiana Lopez Fernandez**

Desarrollo Web — Jala University, 2026.

## Licencia

Proyecto académico desarrollado con fines educativos.