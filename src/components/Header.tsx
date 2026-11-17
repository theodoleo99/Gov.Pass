import React from 'react';
import { Eye, Volume2, VolumeX, HelpCircle, Moon, Sun } from 'lucide-react';
import { AccessibilitySettings } from '../types/index.js';
import { isSpeaking, stopSpeaking } from '../services/speechService.js';

interface HeaderProps {
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  accessibility,
  setAccessibility,
  onOpenHelp
}) => {
  const toggleHighContrast = () => {
    setAccessibility(prev => {
      const nextContrast = !prev.highContrast;
      if (nextContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      return { ...prev, highContrast: nextContrast };
    });
  };

  const toggleDarkMode = () => {
    setAccessibility(prev => {
      const nextDark = !prev.darkMode;
      if (nextDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('high-contrast');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return {
        ...prev,
        darkMode: nextDark,
        highContrast: nextDark ? false : prev.highContrast
      };
    });
  };

  const cycleFontScale = () => {
    const scales: Array<'sm' | 'md' | 'lg' | 'xl'> = ['md', 'lg', 'xl', 'sm'];
    setAccessibility(prev => {
      const nextIdx = (scales.indexOf(prev.fontScale) + 1) % scales.length;
      const nextScale = scales[nextIdx];
      
      document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
      document.documentElement.classList.add(`font-scale-${nextScale}`);
      
      return { ...prev, fontScale: nextScale };
    });
  };

  const toggleGlobalAudio = () => {
    if (accessibility.isAudioReadingActive || isSpeaking()) {
      stopSpeaking();
      setAccessibility(prev => ({ ...prev, isAudioReadingActive: false }));
    } else {
      setAccessibility(prev => ({ ...prev, isAudioReadingActive: true }));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Zone: Gov.Pass Logo & Wordmark */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <img
              src="/assets/aistudio/image_51b93afc.png"
              alt="Logo Gov.Pass: Atleta em movimento cercado por bolas esportivas e flechas dinâmicas"
              className="h-11 w-auto sm:h-14 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap">
                Gov.<span className="text-blue-600 dark:text-blue-400">Pass</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide whitespace-nowrap">
                Esporte Público & Inclusivo · Brasil
              </span>
            </div>
          </div>

          {/* Accessibility Quick Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Dark Mode Quick Toggle Button */}
            <button
              onClick={toggleDarkMode}
              aria-pressed={accessibility.darkMode}
              aria-label={accessibility.darkMode ? 'Desativar Modo Escuro e voltar ao Modo Claro' : 'Ativar Modo Escuro'}
              title={accessibility.darkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
              className={`min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap shrink-0 ${
                accessibility.darkMode
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {accessibility.darkMode ? (
                <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {accessibility.darkMode ? 'Modo Claro' : 'Modo Escuro'}
              </span>
            </button>

            {/* High Contrast Mode Toggle Button (>= 44px hit area) */}
            <button
              onClick={toggleHighContrast}
              aria-pressed={accessibility.highContrast}
              aria-label={accessibility.highContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste para Acessibilidade Visual'}
              title="Alto Contraste (Acessibilidade Visual)"
              className={`min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap shrink-0 ${
                accessibility.highContrast
                  ? 'bg-yellow-400 text-black border-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Contraste</span>
            </button>

            {/* Dynamic Font Scaler (A- / A+) */}
            <button
              onClick={cycleFontScale}
              aria-label={`Ajustar tamanho da fonte. Atual: ${accessibility.fontScale.toUpperCase()}`}
              title="Ajustar tamanho de fonte (A-, A, A+)"
              className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <span className="font-bold text-sm">A</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                {accessibility.fontScale === 'sm' ? '-' : accessibility.fontScale === 'lg' ? '+' : accessibility.fontScale === 'xl' ? '++' : 'pad'}
              </span>
            </button>

            {/* Audio Reader Toggle */}
            <button
              onClick={toggleGlobalAudio}
              aria-label={accessibility.isAudioReadingActive ? 'Parar leitura de voz' : 'Ativar leitor de áudio em voz alta'}
              title="Leitor de Áudio Acessível"
              className={`min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap shrink-0 ${
                accessibility.isAudioReadingActive
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              {accessibility.isAudioReadingActive ? (
                <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden md:inline">
                {accessibility.isAudioReadingActive ? 'Parar Áudio' : 'Voz'}
              </span>
            </button>

            {/* Quick Help Guide */}
            <button
              onClick={onOpenHelp}
              aria-label="Como usar o Gov.Pass: Guia simplificado"
              title="Ajuda e Orientações"
              className="min-h-[44px] min-w-[44px] p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
            >
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
