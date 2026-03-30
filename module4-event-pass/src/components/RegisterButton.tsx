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

import { useOptimistic, useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { registerForEventAction } from '@/actions/eventActions';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegisterButtonProps {
  eventId: string;
  availableSpots: number;
  isAvailable: boolean;
}

export function RegisterButton({
  eventId,
  availableSpots,
  isAvailable,
}: RegisterButtonProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [optimisticSpots, addOptimistic] = useOptimistic(
    availableSpots,
    (currentSpots: number, _action: 'register') => Math.max(0, currentSpots - 1)
  );

  const showRegistered = optimisticSpots < availableSpots;
  const canRegister = isAvailable && optimisticSpots > 0 && !showRegistered;

  async function handleRegister(): Promise<void> {
    setErrorMessage(null);
    startTransition(async () => {
      addOptimistic('register');
      const result = await registerForEventAction(eventId);
      if (!result.success) {
        setErrorMessage(result.message ?? 'Error al registrarse. Intenta de nuevo.');
      }
    });
  }

  if (showRegistered) {
    return (
      <div className="space-y-2">
        <Button variant="secondary" disabled className="w-full gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          ¡Registrado!
        </Button>
        <p className="flex items-center gap-1 text-center text-sm text-green-600">
          <CheckCircle className="h-3 w-3" />
          Te hemos registrado correctamente
        </p>
      </div>
    );
  }

  if (!canRegister) {
    return (
      <Button variant="secondary" disabled className="w-full">
        {optimisticSpots === 0 ? 'Evento Agotado' : 'No disponible'}
      </Button>
    );
  }

  return (
    <div className="space-y-2">
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
      {errorMessage && (
        <p className="flex items-center gap-1 text-center text-sm text-destructive">
          <AlertCircle className="h-3 w-3" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
