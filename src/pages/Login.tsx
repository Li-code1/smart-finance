import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login, cadastrar } = useAuth();
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setEnviando(true);

    if (modo === 'login') {
      const erroLogin = await login(email, senha);
      if (erroLogin) setErro(erroLogin);
    } else {
      const erroCadastro = await cadastrar(email, senha);
      if (erroCadastro) {
        setErro(erroCadastro);
      } else {
        setAviso('Cadastro realizado! Verifique seu e-mail para confirmar a conta e depois faça login.');
        setModo('login');
      }
    }

    setEnviando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-indigo-600">SmartFinance</h2>
          <p className="text-slate-400 font-medium">Painel de Gestão Inteligente</p>
        </div>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => { setModo('login'); setErro(null); setAviso(null); }}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${modo === 'login' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setModo('cadastro'); setErro(null); setAviso(null); }}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${modo === 'cadastro' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
          >
            Criar conta
          </button>
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              minLength={6}
              required
            />
          </div>
        </div>

        {erro && (
          <p className="text-red-600 text-sm font-bold mt-4 text-left">{erro}</p>
        )}
        {aviso && (
          <p className="text-emerald-600 text-sm font-bold mt-4 text-left">{aviso}</p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-indigo-600 text-white p-4 rounded-xl font-black mt-8 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-60"
        >
          {enviando ? 'Aguarde...' : modo === 'login' ? 'Entrar no Sistema' : 'Criar minha conta'}
        </button>
      </form>
    </div>
  );
};
