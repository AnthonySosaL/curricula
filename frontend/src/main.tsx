import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { UiPreferencesProvider } from '@/contexts/ui-preferences';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UiPreferencesProvider>
      <App />
    </UiPreferencesProvider>
  </StrictMode>,
);

