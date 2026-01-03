import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-lg font-medium text-white">Construyendo Sistema Operativo...</p>
        <p className="text-sm text-gray-400">Compilando kernel visual · Renderizando drivers CSS · Montando filesystem HTML</p>
      </div>
    </div>
  );
};
