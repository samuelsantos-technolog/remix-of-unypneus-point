import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw, Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SyncLog, ORIGIN_CONFIG, RecordOrigin } from '@/types/registrations';

interface AuditLogModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  recordId: string;
  origin: RecordOrigin;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  lastSyncAt?: Date;
  logs: SyncLog[];
}

export const AuditLogModal = ({
  open,
  onClose,
  title,
  recordId,
  origin,
  createdAt,
  createdBy,
  updatedAt,
  lastSyncAt,
  logs,
}: AuditLogModalProps) => {
  const originConfig = ORIGIN_CONFIG[origin];

  const getActionIcon = (action: SyncLog['action']) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'update':
        return <Pencil className="h-4 w-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'sync':
        return <RefreshCw className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const getActionLabel = (action: SyncLog['action']) => {
    switch (action) {
      case 'create':
        return 'Criado';
      case 'update':
        return 'Atualizado';
      case 'delete':
        return 'Removido';
      case 'sync':
        return 'Sincronizado';
      default:
        return action;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Log de Auditoria
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Record Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{title}</span>
              <Badge className={originConfig.color}>{originConfig.label}</Badge>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              ID: {recordId}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Criado em</p>
              <p className="font-medium">
                {format(createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Criado por</p>
              <p className="font-medium">{createdBy}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Última atualização</p>
              <p className="font-medium">
                {format(updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            {lastSyncAt && (
              <div>
                <p className="text-muted-foreground">Última sincronização</p>
                <p className="font-medium">
                  {format(lastSyncAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            )}
          </div>

          {/* Log Timeline */}
          <div>
            <h4 className="text-sm font-medium mb-3">Histórico de Alterações</h4>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    <div className="mt-0.5">
                      {log.status === 'success' ? (
                        <div className="p-1.5 bg-green-100 rounded-full">
                          {getActionIcon(log.action)}
                        </div>
                      ) : (
                        <div className="p-1.5 bg-red-100 rounded-full">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {getActionLabel(log.action)}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            log.status === 'success'
                              ? 'text-green-700 border-green-300'
                              : 'text-red-700 border-red-300'
                          }
                        >
                          {log.status === 'success' ? 'Sucesso' : 'Erro'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {log.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(log.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} - {log.userName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
