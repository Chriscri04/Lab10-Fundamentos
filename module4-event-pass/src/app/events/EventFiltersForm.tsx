// =============================================================================
// COMPONENTE EVENT FILTERS FORM - Module 4: Event Pass
// =============================================================================
// Formulario de filtros mejorado con interactividad.
//
// ## Client Component
// Lo hemos convertido a 'use client' para permitir:
// 1. Auto-submit al cambiar selectores (UX más fluida)
// 2. Mantener la URL sincronizada sin recargas completas
// 3. Búsqueda con debounce para escribir y filtrar automáticamente
//
// ## Progressive Enhancement
// Aunque usamos JS para mejorar la UX, el formulario sigue usando 
// method="GET" y action="/events", por lo que es robusto y estándar.
// =============================================================================

'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  EVENT_CATEGORIES,
  CATEGORY_LABELS,
  EVENT_STATUSES,
  STATUS_LABELS,
  type EventCategory,
} from '@/types/event';
import { useDebounce } from '@/hooks/use-debounce';

interface EventFiltersFormProps {
  currentFilters: {
    search?: string;
    category?: EventCategory;
    status?: string;
    priceMax?: number;
  };
}

const PRICE_LABELS: Record<string, string> = {
  '0': 'Gratis',
  '25': 'Hasta $25',
  '50': 'Hasta $50',
  '100': 'Hasta $100',
  '200': 'Hasta $200',
};

export function EventFiltersForm({ currentFilters }: EventFiltersFormProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(currentFilters.search ?? '');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const isFirstRender = useRef(true);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/events?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateParams({ search: debouncedSearch });
  }, [debouncedSearch, updateParams]);

  const handleSelectChange = (key: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ [key]: e.target.value });
  };

  const activeFilters: { key: string; label: string }[] = [];
  if (currentFilters.search) activeFilters.push({ key: 'search', label: `"${currentFilters.search}"` });
  if (currentFilters.category) activeFilters.push({ key: 'category', label: CATEGORY_LABELS[currentFilters.category] });
  if (currentFilters.status) activeFilters.push({ key: 'status', label: STATUS_LABELS[currentFilters.status as keyof typeof STATUS_LABELS] });
  if (currentFilters.priceMax !== undefined) activeFilters.push({ key: 'priceMax', label: PRICE_LABELS[String(currentFilters.priceMax)] });

  const hasFilters = activeFilters.length > 0;

  const removeFilter = (key: string) => {
    if (key === 'search') setSearchTerm('');
    updateParams({ [key]: '' });
  };

  const clearAll = () => {
    setSearchTerm('');
    router.push('/events');
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="space-y-4">
        {/* Búsqueda */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Selects */}
        <div className="flex flex-wrap gap-4">
          {/* Categoría */}
          <select
            name="category"
            value={currentFilters.category ?? ''}
            onChange={handleSelectChange('category')}
            className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Todas las categorías</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            name="status"
            value={currentFilters.status ?? ''}
            onChange={handleSelectChange('status')}
            className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Todos los estados</option>
            {EVENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          {/* Precio máximo */}
          <select
            name="priceMax"
            value={currentFilters.priceMax?.toString() ?? ''}
            onChange={handleSelectChange('priceMax')}
            className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Cualquier precio</option>
            <option value="0">Gratis</option>
            <option value="25">Hasta $25</option>
            <option value="50">Hasta $50</option>
            <option value="100">Hasta $100</option>
            <option value="200">Hasta $200</option>
          </select>
        </div>
      </div>

      {/* Filtros activos (badges) */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          {activeFilters.map(({ key, label }) => (
            <span
              key={key}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {label}
              <button
                onClick={() => removeFilter(key)}
                className="ml-1 rounded-full hover:text-primary/70"
                aria-label={`Quitar filtro ${label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpiar todo
          </Button>
        </div>
      )}
    </div>
  );
}