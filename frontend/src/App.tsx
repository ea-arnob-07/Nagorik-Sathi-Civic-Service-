import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { CaseProvider } from './context/CaseContext';
import { AppRoutes } from './routes/AppRoutes';
import { LanguageDomBridge } from './components/common/LanguageDomBridge';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <LanguageDomBridge />
          <AccessibilityProvider>
            <AuthProvider>
              <ToastProvider>
                <CaseProvider>
                  <AppRoutes />
                </CaseProvider>
              </ToastProvider>
            </AuthProvider>
          </AccessibilityProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
