import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';

export const LoginView: React.FC = () => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (username.length < 3 || pin.length < 4) {
      setError("Username min 3 chars, PIN 4 digits");
      setIsLoading(false);
      return;
    }

    try {
      let success;
      if (isLogin) {
        success = await login(username, pin);
        if (!success) setError(t.loginError);
      } else {
        success = await register(username, pin);
        if (!success) setError(t.registerError);
      }
    } catch (e) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-600 to-teal-800">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧊</div>
          <h1 className="text-2xl font-black text-emerald-900">{t.appTitle}</h1>
          <p className="text-emerald-600 font-medium text-sm">{isLogin ? t.loginSub : t.createAccount}</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            {t.login}
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            {t.register}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">{t.username}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="e.g. chef123"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">{t.pin}</label>
            <input
              type="tel"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-gray-700 tracking-[0.5em] text-center focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="••••"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100 animate-bounce">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username || !pin}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>{isLogin ? t.login : t.register}</span>
            )}
            {!isLoading && <span>→</span>}
          </button>
        </form>

        <p className="text-center mt-6 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
          Secure • Offline • Private
        </p>
      </div>
    </div>
  );
};