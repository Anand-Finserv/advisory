import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("FATAL: Root element not found in DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <Suspense fallback={
          <div className="h-screen bg-slate-900 flex flex-col items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-6"></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center">Loading Systems...</p>
          </div>
        }>
          <App />
        </Suspense>
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React Render Error:", err);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h2>Application Error</h2>
      <p>Please check the browser console for details.</p>
    </div>`;
  }
}