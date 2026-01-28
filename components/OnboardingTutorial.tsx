import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: t.welcomeTitle,
      text: t.welcomeText,
      icon: "👋",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: t.snapTitle,
      text: t.snapText,
      icon: "📸",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: t.cookTitle,
      text: t.cookText,
      icon: "👨‍🍳",
      color: "bg-amber-50 text-amber-600"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50 rounded-full opacity-50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-end">
            <button 
              onClick={onComplete}
              className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 px-2 py-1"
            >
              {t.skip}
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className={`w-24 h-24 ${steps[step].color} rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-sm transition-colors duration-500`}>
              {steps[step].icon}
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-4 transition-all duration-300">
              {steps[step].title}
            </h2>
            
            <p className="text-gray-500 font-medium leading-relaxed px-2 transition-all duration-300 min-h-[4.5rem]">
              {steps[step].text}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? 'w-8 bg-emerald-600' : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all"
            >
              {step === steps.length - 1 ? t.letsCook : t.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};