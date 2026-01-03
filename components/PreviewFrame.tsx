import React, { useEffect, useRef } from 'react';

interface PreviewFrameProps {
  html: string;
  title: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ html, title }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      // Clear previous content
      iframe.srcdoc = '';
      
      // We use a slight timeout to ensure the browser processes the clear before setting new content
      // and to create a smooth transition effect if needed.
      const timer = setTimeout(() => {
        iframe.srcdoc = html;
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [html]);

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden border border-gray-700 shadow-2xl relative group">
        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 flex items-center px-2 space-x-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs text-gray-400 font-mono">{title} - Preview</span>
        </div>
      <iframe
        ref={iframeRef}
        title="OS Preview"
        className="w-full h-full border-0 bg-white"
        sandbox="allow-scripts allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin"
      />
    </div>
  );
};
