import React, { useState } from 'react';
import { BookOpen, Zap, Users, Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (error) {
      setError('Credenciales inválidas. Usa password: "password"');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@mindrush.com', role: 'Administrador', color: 'bg-red-500', icon: Users },
    { email: 'teacher@mindrush.com', role: 'Docente', color: 'bg-blue-500', icon: BookOpen },
    { email: 'student@mindrush.com', role: 'Estudiante', color: 'bg-green-500', icon: Trophy }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-2 lg:p-4">
      <div className="max-w-md w-full">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
              <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">MindRush</h1>
          <p className="text-blue-200 text-sm lg:text-base">Plataforma Educativa Revolucionaria</p>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 lg:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm lg:text-base"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm lg:text-base"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-purple-900 transition-all duration-200 flex items-center justify-center text-sm lg:text-base"
            >
              {isLoading ? (
                <div className="w-4 h-4 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Cuentas Demo */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-white/80 text-xs lg:text-sm text-center mb-4">Cuentas de demostración:</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('password');
                  }}
                  className="w-full flex items-center justify-between p-2 lg:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div className={`${account.color} p-1.5 lg:p-2 rounded-full mr-2 lg:mr-3`}>
                      <account.icon className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium text-sm lg:text-base">{account.role}</div>
                      <div className="text-white/70 text-xs lg:text-sm">{account.email}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 text-white/60" />
                </button>
              ))}
            </div>
            
            {/* Diagnostic Link */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <a 
                href="#diagnostic" 
                className="block w-full text-center text-white/70 text-xs hover:text-white transition-colors"
              >
                🔧 Diagnóstico del Sistema
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};