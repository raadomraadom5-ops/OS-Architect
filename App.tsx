import React, { useState, useEffect } from 'react';
import { Terminal, Monitor, Code, Play, History, Sparkles, AlertCircle, Download } from 'lucide-react';
import { generateOSCode } from './services/geminiService';
import { PreviewFrame } from './components/PreviewFrame';
import { CodeViewer } from './components/CodeViewer';
import { Loader } from './components/Loader';
import { GeneratedOS, ViewMode } from './types';

const INITIAL_OS: GeneratedOS = {
  id: 'init',
  name: 'BienvenidoOS',
  description: 'Sistema inicial de demostración',
  createdAt: Date.now(),
  html: `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      body { margin: 0; background: #0f172a; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
      .window { background: #1e293b; border: 1px solid #334155; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); width: 400px; padding: 20px; text-align: center; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      h1 { margin-top: 0; color: #60a5fa; }
      button { background: #3b82f6; border: none; padding: 10px 20px; color: white; border-radius: 4px; cursor: pointer; margin-top: 20px; transition: background 0.2s; }
      button:hover { background: #2563eb; }
      @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    </style>
    </head>
    <body>
      <div class="window">
        <h1>Bienvenido al Generador de SO</h1>
        <p>Escribe un prompt a la izquierda para generar tu propio sistema operativo simulado en HTML.</p>
        <button onclick="alert('¡Listo para crear!')">Comenzar</button>
      </div>
    </body>
    </html>
  `
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentOS, setCurrentOS] = useState<GeneratedOS>(INITIAL_OS);
  const [history, setHistory] = useState<GeneratedOS[]>([INITIAL_OS]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PREVIEW);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await generateOSCode(prompt);
      
      const newOS: GeneratedOS = {
        id: crypto.randomUUID(),
        name: result.name,
        description: result.description,
        html: result.html,
        createdAt: Date.now()
      };

      setHistory(prev => [newOS, ...prev]);
      setCurrentOS(newOS);
      setPrompt('');
      setViewMode(ViewMode.PREVIEW);
    } catch (err) {
      setError("Hubo un error al generar el SO. Por favor intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (os: GeneratedOS) => {
    setCurrentOS(os);
    setViewMode(ViewMode.PREVIEW);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([currentOS.html], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    const safeName = currentOS.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'sistema_operativo';
    element.download = `${safeName}.html`;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col md:flex-row text-white overflow-hidden font-sans">
      
      {/* Left Sidebar / Control Panel */}
      <aside className="w-full md:w-96 flex flex-col bg-gray-900 border-r border-gray-800 h-[40vh] md:h-full z-20 shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center space-x-3 bg-gray-900">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Terminal size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">OS Architect</h1>
            <p className="text-xs text-gray-400">Impulsado por Gemini 2.0</p>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-5 flex-shrink-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Describe tu Sistema Operativo
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Un sistema operativo estilo Cyberpunk 2077 con neones verdes, consola hacker y ventanas translúcidas..."
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all ${
                loading || !prompt.trim()
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {loading ? (
                <span>Generando...</span>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generar Sistema</span>
                </>
              )}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-start space-x-2">
              <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-200">{error}</p>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="px-3 pb-2 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
            <History size={12} className="mr-1.5" /> Historial de Versiones
          </div>
          <div className="space-y-1 pb-4">
            {history.map((os) => (
              <button
                key={os.id}
                onClick={() => loadFromHistory(os)}
                className={`w-full text-left p-3 rounded-lg flex flex-col transition-colors ${
                  currentOS.id === os.id
                    ? 'bg-gray-800 border border-gray-700'
                    : 'hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={`text-sm font-medium ${currentOS.id === os.id ? 'text-blue-400' : 'text-gray-300'}`}>
                    {os.name}
                  </span>
                  <span className="text-[10px] text-gray-600 bg-gray-900 px-1.5 py-0.5 rounded">
                    HTML
                  </span>
                </div>
                <span className="text-xs text-gray-500 truncate w-full mt-1">
                  {os.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[60vh] md:h-full relative bg-gray-950">
        
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-6 absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-medium text-gray-200 flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              {currentOS.name}
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all text-xs font-medium"
              title="Descargar HTML"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Descargar</span>
            </button>

            <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
              <button
                onClick={() => setViewMode(ViewMode.PREVIEW)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === ViewMode.PREVIEW
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Monitor size={14} />
                <span>Vista Previa</span>
              </button>
              <button
                onClick={() => setViewMode(ViewMode.CODE)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === ViewMode.CODE
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Code size={14} />
                <span>Código</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 pt-14 p-4 md:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black">
          {loading ? (
            <Loader />
          ) : (
            <div className="w-full h-full animate-in fade-in zoom-in duration-300">
              {viewMode === ViewMode.PREVIEW ? (
                <PreviewFrame html={currentOS.html} title={currentOS.name} />
              ) : (
                <CodeViewer code={currentOS.html} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}