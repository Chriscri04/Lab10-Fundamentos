# Stack Tecnológico - Módulo 4

## Versiones de Dependencias (Diciembre 2025)

Este documento registra las versiones exactas de las dependencias utilizadas en este módulo, actualizadas en diciembre de 2025.

---

## Dependencias de Produccion

| Paquete                    | Version  | Proposito                                      |
| -------------------------- | -------- | ---------------------------------------------- |
| next                       | 16.1.1   | Framework React fullstack                      |
| react                      | 19.2.1   | Biblioteca UI                                  |
| react-dom                  | 19.2.1   | Renderizado React para DOM                     |
| zod                        | 4.1.9    | Validacion de esquemas en runtime              |
| @radix-ui/react-dialog     | 1.1.4    | Componente Dialog accesible                    |
| @radix-ui/react-label      | 2.1.1    | Componente Label accesible                     |
| @radix-ui/react-select     | 2.1.4    | Componente Select accesible                    |
| @radix-ui/react-slot       | 1.1.1    | Utilidad para composición                      |
| @radix-ui/react-toast      | 1.2.4    | Notificaciones toast                           |
| class-variance-authority   | 0.7.1    | Variantes de componentes                       |
| clsx                       | 2.1.1    | Utilidad para clases condicionales             |
| tailwind-merge             | 2.6.0    | Merge de clases Tailwind                       |
| lucide-react               | 0.469.0  | Iconos React                                   |

---

## Dependencias de Desarrollo

| Paquete              | Version  | Proposito                                      |
| -------------------- | -------- | ---------------------------------------------- |
| typescript           | 5.9.3    | Lenguaje con tipado estatico                   |
| tailwindcss          | 4.1.8    | Framework CSS utility-first (v4)               |
| @tailwindcss/postcss | 4.1.8    | Plugin PostCSS para Tailwind v4                |
| eslint               | 9.17.0   | Linter para JavaScript/TypeScript              |
| eslint-config-next   | 16.1.1   | Configuracion ESLint para Next.js              |
| @types/react         | 19.2.1   | Tipos de TypeScript para React                 |
| @types/react-dom     | 19.2.1   | Tipos de TypeScript para React DOM             |
| @types/node          | 22.10.2  | Tipos de TypeScript para Node.js               |

---

## Notas sobre las versiones

### Next.js 16.1.1

- **App Router**: Sistema de enrutamiento basado en archivos
- **Server Components**: Renderizado en servidor por defecto
- **Server Actions**: Mutaciones directas sin API routes
- **Turbopack**: Bundler de desarrollo ultrarapido

### Tailwind CSS 4.1.8

- **@tailwindcss/postcss**: Plugin para Next.js (reemplaza PostCSS manual)
- **Configuración CSS-first**: Sin tailwind.config.js
- **Tema en CSS**: Variables definidas con `@theme inline`

---

## Cambios vs Versión Anterior

| Aspecto              | Antes (v3)           | Ahora (v4)            |
| -------------------- | -------------------- | --------------------- |
| Tailwind CSS         | 3.4.17               | 4.1.8                 |
| PostCSS Plugin       | tailwindcss          | @tailwindcss/postcss  |
| Autoprefixer         | Requerido            | Incluido en Tailwind  |
| tailwind.config.ts   | Requerido            | Eliminado             |
| CSS Import           | `@tailwind base;`    | `@import 'tailwindcss'` |
| Tema Shadcn          | JS config            | `@theme inline`       |

---

## Requisitos del Sistema

| Requisito          | Mínimo    | Recomendado |
| ------------------ | --------- | ----------- |
| Node.js            | 20.19+    | 22.12+      |
| npm                | 10.0+     | 10.9+       |

---

## Navegadores Soportados

Tailwind CSS v4 requiere navegadores modernos:

| Navegador          | Versión Mínima |
| ------------------ | -------------- |
| Chrome             | 111+           |
| Firefox            | 128+           |
| Safari             | 16.4+          |
| Edge               | 111+           |

---

## Verificación de Versiones

```bash
# TypeScript
npx tsc --version

# Next.js
npx next --version

# Node.js
node --version

# npm
npm --version
```
