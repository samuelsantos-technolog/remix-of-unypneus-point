import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineStep {
  status: string;
  label: string;
  description: string;
  color: string;
  category?: string;
  impact?: string[];
  isActive?: boolean;
  isCompleted?: boolean;
}

interface StatusTimelineModalProps {
  title: string;
  subtitle?: string;
  steps: TimelineStep[];
  currentStatus?: string;
  trigger?: React.ReactNode;
}

export const StatusTimelineModal = ({
  title,
  subtitle,
  steps,
  currentStatus,
  trigger
}: StatusTimelineModalProps) => {
  const currentIndex = currentStatus 
    ? steps.findIndex(s => s.status === currentStatus) 
    : -1;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="h-4 w-4" />
            Ver Linha do Tempo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {title}
          </DialogTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </DialogHeader>

        <div className="mt-6 relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-0">
            {steps.map((step, index) => {
              const isCompleted = currentIndex >= 0 && index < currentIndex;
              const isCurrent = index === currentIndex;
              const isPending = currentIndex >= 0 && index > currentIndex;

              return (
                <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Timeline dot */}
                  <div className={cn(
                    "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background",
                    isCompleted && "border-green-500 bg-green-50",
                    isCurrent && "border-primary bg-primary/10 ring-4 ring-primary/20",
                    isPending && "border-muted-foreground/30",
                    !currentStatus && "border-muted-foreground/50"
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : isCurrent ? (
                      <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
                    ) : (
                      <Circle className={cn(
                        "h-5 w-5",
                        isPending ? "text-muted-foreground/40" : "text-muted-foreground"
                      )} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn(
                    "flex-1 pt-1.5",
                    isPending && "opacity-50"
                  )}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className={cn(
                          "font-semibold",
                          isCurrent && "text-primary"
                        )}>
                          {step.label}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={cn("text-xs mt-1", step.color)}
                        >
                          {step.status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                      {step.category && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {step.category}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      {step.description}
                    </p>

                    {step.impact && step.impact.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs text-muted-foreground">Impacta:</span>
                        {step.impact.map(item => (
                          <Badge key={item} variant="secondary" className="text-xs">
                            {item === 'cash' && 'Caixa'}
                            {item === 'schedule' && 'Agenda'}
                            {item === 'margin' && 'Margem'}
                            {item === 'commission' && 'Repasse'}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Arrow to next step */}
                    {index < steps.length - 1 && (
                      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <ArrowRight className="h-3 w-3" />
                        <span>Próximo: {steps[index + 1].label}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Legenda:</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Concluído</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              <span>Em andamento</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Circle className="h-4 w-4 text-muted-foreground/40" />
              <span>Pendente</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions to convert status configs to timeline steps
export const purchaseOrderStepsToTimeline = (
  config: Record<string, { label: string; description: string; color: string; category: string }>
): TimelineStep[] => {
  return Object.entries(config)
    .filter(([key]) => key !== 'order_cancelled')
    .map(([status, data]) => ({
      status,
      label: data.label,
      description: data.description,
      color: data.color,
      category: data.category
    }));
};

export const salesOrderStepsToTimeline = (
  config: Record<string, { label: string; description: string; color: string; category: string }>
): TimelineStep[] => {
  return Object.entries(config)
    .filter(([key]) => key !== 'cancelled' && key !== 'returned')
    .map(([status, data]) => ({
      status,
      label: data.label,
      description: data.description,
      color: data.color,
      category: data.category
    }));
};

export const financialStepsToTimeline = (
  config: Record<string, { label: string; description: string; color: string; impact: string[] }>
): TimelineStep[] => {
  return Object.entries(config).map(([status, data]) => ({
    status,
    label: data.label,
    description: data.description,
    color: data.color,
    impact: data.impact
  }));
};

export const loadStepsToTimeline = (
  config: Record<string, { label: string; description: string; color: string; category: string }>
): TimelineStep[] => {
  return Object.entries(config)
    .filter(([key]) => key !== 'cancelled')
    .map(([status, data]) => ({
      status,
      label: data.label,
      description: data.description,
      color: data.color,
      category: data.category
    }));
};
