// =============================================================================
// TIPOS DE EVENTO - Module 4: Event Pass
// =============================================================================
// Define los tipos de datos para eventos usando Zod para validación.
//
// ## Zod en Next.js
// Zod es especialmente útil con Server Actions porque:
// 1. Valida datos del cliente antes de procesarlos
// 2. Genera tipos TypeScript automáticamente
// 3. Proporciona mensajes de error estructurados
// =============================================================================

import { z } from 'zod';

// =============================================================================
// ENUMS Y CONSTANTES
// =============================================================================

/**
 * Categorías de eventos disponibles.
 */
export const EVENT_CATEGORIES = [
  'conferencia',
  'taller',
  'concierto',
  'exposicion',
  'networking',
  'deportivo',
  'cultural',
  'otro',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

/**
 * Estados posibles de un evento.
 */
export const EVENT_STATUSES = ['borrador', 'publicado', 'cancelado', 'finalizado'] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

/**
 * Etiquetas para mostrar en español.
 */
export const CATEGORY_LABELS: Record<EventCategory, string> = {
  conferencia: 'Conferencia',
  taller: 'Taller',
  concierto: 'Concierto',
  exposicion: 'Exposición',
  networking: 'Networking',
  deportivo: 'Deportivo',
  cultural: 'Cultural',
  otro: 'Otro',
};

export const STATUS_LABELS: Record<EventStatus, string> = {
  borrador: 'Borrador',
  publicado: 'Publicado',
  cancelado: 'Cancelado',
  finalizado: 'Finalizado',
};

// =============================================================================
// ESQUEMAS ZOD
// =============================================================================

/**
 * Esquema base para un evento.
 * Usamos Zod para validación tanto en cliente como en servidor.
 */
/**
 * Regex para validar formato datetime-local (YYYY-MM-DDTHH:MM) o ISO completo.
 * El input datetime-local no incluye timezone, asi que aceptamos ambos formatos.
 */
const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?([+-]\d{2}:\d{2}|Z)?$/;

export const eventSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(5, 'El titulo debe tener al menos 5 caracteres')
    .max(100, 'El titulo no puede exceder 100 caracteres'),
  description: z
    .string()
    .min(20, 'La descripcion debe tener al menos 20 caracteres')
    .max(1000, 'La descripcion no puede exceder 1000 caracteres'),
  category: z.enum(EVENT_CATEGORIES),
  status: z.enum(EVENT_STATUSES),
  date: z.string().regex(datetimeRegex, 'Formato de fecha invalido'),
  endDate: z.string().regex(datetimeRegex, 'Formato de fecha invalido').optional(),
  location: z.string().min(5, 'La ubicacion debe tener al menos 5 caracteres'),
  address: z.string().min(10, 'La direccion debe tener al menos 10 caracteres'),
  capacity: z.number().int().min(1, 'La capacidad minima es 1'),
  registeredCount: z.number().int().min(0).default(0),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  imageUrl: z.string().url().optional(),
  organizerName: z.string().min(2, 'El nombre del organizador es requerido'),
  organizerEmail: z.string().email('Email del organizador invalido'),
  tags: z.array(z.string()).max(5, 'Maximo 5 etiquetas'),
  createdAt: z.string().regex(datetimeRegex, 'Formato de fecha invalido'),
  updatedAt: z.string().regex(datetimeRegex, 'Formato de fecha invalido'),
});

/**
 * Esquema para crear un evento (sin id, timestamps ni registeredCount).
 */
export const createEventSchema = eventSchema.omit({
  id: true,
  registeredCount: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Esquema para actualizar un evento (todos los campos opcionales).
 */
export const updateEventSchema = createEventSchema.partial();

// =============================================================================
// TIPOS INFERIDOS
// =============================================================================

/**
 * Tipo completo de un evento.
 */
export type Event = z.infer<typeof eventSchema>;

/**
 * Tipo para crear un evento.
 */
export type CreateEventInput = z.infer<typeof createEventSchema>;

/**
 * Tipo para actualizar un evento.
 */
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// =============================================================================
// TIPOS PARA FORMULARIOS Y UI
// =============================================================================

/**
 * Valores del formulario para preservar en caso de error.
 */
export interface FormValues {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  date?: string;
  endDate?: string;
  location?: string;
  address?: string;
  capacity?: string;
  price?: string;
  imageUrl?: string;
  organizerName?: string;
  organizerEmail?: string;
  tags?: string;
}

/**
 * Estado del formulario para Server Actions.
 *
 * ## Por que este patron?
 * Los Server Actions retornan un estado que indica:
 * - Si la operacion fue exitosa
 * - Errores de validacion por campo
 * - Mensaje general para el usuario
 * - Valores del formulario para preservar en caso de error
 */
export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: Event;
  values?: FormValues;
}

/**
 * Filtros para buscar eventos.
 */
export interface EventFilters {
  search?: string;
  category?: EventCategory;
  status?: EventStatus;
  dateFrom?: string;
  dateTo?: string;
  priceMax?: number;
}
