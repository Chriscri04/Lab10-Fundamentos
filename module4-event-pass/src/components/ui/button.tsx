// =============================================================================
// COMPONENTE BUTTON - Shadcn UI
// =============================================================================
// Botón con variantes siguiendo el patrón de Shadcn UI.
// =============================================================================

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Definición de variantes del botón usando CVA.
 *
 * ## class-variance-authority (CVA)
 * CVA permite definir variantes de componentes de forma type-safe.
 * Es el patrón que usa Shadcn UI para manejar estilos condicionales.
 */
const buttonVariants = cva(
  // Estilos base (siempre aplicados)
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      // Variante de estilo visual
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      // Variante de tamaño
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    // Valores por defecto
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Props del botón.
 *
 * ## asChild Pattern
 * El prop `asChild` permite que el botón se renderice como otro componente.
 * Útil para crear links que parecen botones:
 *
 * @example
 * <Button asChild>
 *   <Link href="/events">Ver eventos</Link>
 * </Button>
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Componente Button con variantes y soporte para polimorfismo.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Si asChild es true, usamos Slot para renderizar el hijo directo
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
