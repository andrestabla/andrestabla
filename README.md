# Andrés Tabla Rico - Supreme Executive Portfolio (Full-Stack CMS)

Esta es la evolución de nivel "Supreme" de la hoja de vida interactiva de **Andrés Tabla Rico**.
Se ha reestructurado usando **Next.js, React, Prisma y PostgreSQL (Neon)** para garantizar credenciales seguras, persistencia de datos y rendimiento de grado Enterprise.

## ✨ Características Premium
- **Diseño "Executive Studio"**: Estética minimalista con tipografías suizas, alto contraste y perfecta adaptación a dispositivos de escritorio y móviles.
- **CMS Integrado Seguro**: Ruta protegida por JWT (`/admin`) para gestionar en tiempo real la información de la base de datos.
- **Next.js Server Components**: El sitio público procesa la base de datos en el servidor, haciendo la carga web instantánea y garantizando el mejor SEO posible.

## 🛠️ Cómo Utilizar el Sistema
1. Entra a la ruta protegida desde tu sitio web (`tusitio.com/login`).
2. Usa el usuario **andres.tabla** y la contraseña **admin123**.
3. En el Panel de Control (`/admin`), podrás modificar el texto de tu Perfil, Experiencia, Formación y Cursos.
4. Presiona **Guardar Cambios**; la base de datos se actualizará y la vista pública cambiará de inmediato.

## 💻 Configuración Local
1. Instala dependencias:
   - `npm install`
2. Crea tu entorno local:
   - `cp .env.example .env.local`
   - `cp .env.local .env`
3. Completa estas variables:
   - `POSTGRES_PRISMA_URL` (URL con pooler de Neon)
   - `POSTGRES_URL_NON_POOLING` (URL directa sin `-pooler`)
   - `JWT_SECRET` (cadena aleatoria robusta)
4. Ejecuta en desarrollo:
   - `npm run dev`

## 🚀 Guía de Despliegue (Production)

Debido a que este proyecto ahora es "Full-Stack" (tiene base de datos y servidor), ya NO puede ser albergado en *GitHub Pages* (que solo permite HTML simple).

**El método recomendado para desplegar este repositorio es [Vercel](https://vercel.com/):**
1. Crea una cuenta gratis en Vercel.com usando tu GitHub.
2. Haz clic en **Add New Project** y selecciona este repositorio (`andrestabla/andrestabla`).
3. En la configuración (Environment Variables), asegúrate de añadir:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `JWT_SECRET`
4. ¡Clickea "Deploy"! Vercel construirá la aplicación full-stack y la conectará a tu base de datos Neon.

---
_Desarrollado como una solución tecnológica escalable en 2026._
