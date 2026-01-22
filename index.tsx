import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  const msg = "FATAL: Root element not found in DOM.";
  console.error(msg);
  document.body.innerHTML += `<div style="color:red; padding:20px;">${msg}</div>`;
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
  } catch (err: any) {
    console.error("React Render Error:", err);
    rootElement.innerHTML = `<div style="padding: 40px; color: #f87171; font-family: sans-serif; background: #0f172a; height: 100vh;">
      <h2 style="font-weight: 900; letter-spacing: -0.05em; color: white;">APPLICATION FAILED TO INITIALIZE</h2>
      <p style="margin-top: 10px; font-size: 14px; opacity: 0.8;">${err?.message || 'Unknown render error'}</p>
      <pre style="margin-top: 20px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; font-size: 11px; color: #94a3b8; overflow: auto;">${err?.stack || ''}</pre>
    </div>`;
  }
}
