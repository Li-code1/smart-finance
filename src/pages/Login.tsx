import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!login(email, pass)) {
      alert("Por favor, preencha as credenciais.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-indigo-600">Consuma+</h2>
          <p className="text-slate-400 font-medium">Painel de Gestão Inteligente</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="user-email" className="block text-sm font-bold text-slate-700 mb-1 text-left">E-mail</label>
            <input 
              id="user-email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>

          <div>
            <label htmlFor="user-pass" className="block text-sm font-bold text-slate-700 mb-1 text-left">Senha</label>
            <input 
              id="user-pass"
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-xl font-black mt-8 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          Entrar no Sistema
        </button>
      </form>
    </div>
  );
};