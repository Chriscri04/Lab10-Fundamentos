// =============================================================================
// COMPONENTE REGISTER BUTTON - Module 4: Event Pass
// =============================================================================
// Botón para registrarse en un evento con actualización optimista.
//
// ## useOptimistic (React 19)
// Este hook permite actualizar la UI inmediatamente antes de que
// la operación del servidor complete. Si falla, React revierte
// automáticamente al estado anterior.
//
// ## Patrón de Actualización Optimista
// 1. Usuario hace clic
// 2. UI se actualiza inmediatamente (optimistic)
// 3. Server Action se ejecuta
// 4. Si falla, UI se revierte automáticamente
// 5. Si éxito, estado se confirma
// =============================================================================

'use client';

import { useOptimistic, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { registerForEventAction } from '@/actions/eventActions';
import { Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegisterButtonProps {
  eventId: string;
  availableSpots: number;
  isAvailable: boolean;
}

/**
 * Botón de registro con actualización optimista.
 *
 * ## Flujo
 * 1. Al hacer clic, `addOptimistic` actualiza spots inmediatamente (-1)
 * 2. `startTransition` inicia la Server Action
 * 3. Mientras pending=true, mostramos spinner
 * 4. Si falla, React revierte automáticamente
 */
export function RegisterButton({
  eventId,
  availableSpots,
  isAvailable,
}: RegisterButtonProps): React.ReactElement {
  /**
   * useTransition permite marcar actualizaciones como no urgentes.
   * isPending indica si hay una transición en progreso.
   */
  const [isPending, startTransition] = useTransition();

  /**
   * useOptimistic crea un estado optimista.
   *
   * @param initialValue - Valor inicial (plazas disponibles)
   * @param reducer - Función que calcula el nuevo valor optimista
   */
  const [optimisticSpots, addOptimistic] = useOptimistic(
    availableSpots,
    // Reducer: cuando se registra, restamos 1
    (currentSpots: number, _action: 'register') => Math.max(0, currentSpots - 1)
  );

  // Estado derivado
  const showRegistered = optimisticSpots < availableSpots;
  const canRegister = isAvailable && optimisticSpots > 0 && !showRegistered;

  /**
   * Handler del registro.
   */
  async function handleRegister(): Promise<void> {
    // 1. Actualización optimista inmediata
    addOptimistic('register');

    // 2. Ejecutar Server Action en una transición
    startTransition(async () => {
      const result = await registerForEventAction(eventId);

      if (!result.success) {
        // Si falla, podríamos mostrar un toast de error
        // El estado optimista se revierte automáticamente
        console.error('Error al registrar:', result.message);
      }
    });
  }

  // Si ya se registró (optimísticamente)
  if (showRegistered) {
    return (
      <Button variant="secondary" disabled className="w-full gap-2">
        <CheckCircle className="h-4 w-4" />
        ¡Registrado!
      </Button>
    );
  }

  // Si no hay plazas
  if (!canRegister) {
    return (
      <Button variant="secondary" disabled className="w-full">
        {optimisticSpots === 0 ? 'Evento Agotado' : 'No disponible'}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRegister}
      disabled={isPending}
      className={cn('w-full gap-2', isPending && 'cursor-wait')}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Registrando...
        </>
      ) : (
        `Registrarme (${optimisticSpots} plazas)`
      )}
    </Button>
  );
}
