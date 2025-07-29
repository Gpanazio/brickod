import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

interface SyncIndicatorProps {
  lastSync: Date | null;
  onForceSync: () => void;
  isLoading?: boolean;
}

export function SyncIndicator({ lastSync, onForceSync, isLoading }: SyncIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center space-x-3">
      {/* Status de Conexão */}
      <div className="flex items-center text-sm text-gray-500">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {/* Última Sincronização */}
      {lastSync && (
        <div className="flex items-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Sync: {lastSync.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      )}

      {/* Botão de Sincronização Manual */}
      <Button
        variant="outline"
        size="sm"
        onClick={onForceSync}
        disabled={isLoading || !isOnline}
        className="text-brick-red hover:bg-brick-red hover:text-white"
      >
        <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        Sincronizar
      </Button>
    </div>
  );
}