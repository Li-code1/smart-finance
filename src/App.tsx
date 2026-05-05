import { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

function AppContent() {
  const { logado } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  // 1. Carregar Dados (Busca local ou servidor)
  useEffect(() => {
    if (logado) {
      fetch('http://localhost:3001/transacoes')
        .then(res => res.json())
        .then(data => setTransacoes(data))
        .catch(() => {
          const salvo = localStorage.getItem('@ConsumaMais:transacoes');
          if (salvo) setTransacoes(JSON.parse(salvo));
        });
    }
  }, [logado]);

  // 2. Adicionar Gasto
  const adicionarGasto = async (novoGasto: Omit<Transacao, 'id'>) => {
    try {
      const res = await fetch('http://localhost:3001/transacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoGasto),
      });
      if (res.ok) {
        const salvo = await res.json();
        setTransacoes(prev => [...prev, salvo]);
        return;
      }
    } catch {
      const transacaoLocal = { ...novoGasto, id: crypto.randomUUID() };
      const novasTransacoes = [...transacoes, transacaoLocal];
      setTransacoes(novasTransacoes);
      localStorage.setItem('@ConsumaMais:transacoes', JSON.stringify(novasTransacoes));
    }
  };

  // 3. Excluir Gasto
  const excluirGasto = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/transacoes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTransacoes(prev => prev.filter(t => t.id !== id));
        return;
      }
    } catch {
      const filtradas = transacoes.filter(t => t.id !== id);
      setTransacoes(filtradas);
      localStorage.setItem('@ConsumaMais:transacoes', JSON.stringify(filtradas));
    }
  };

  if (!logado) return <Login />;

  return (
    <Dashboard 
      transacoes={transacoes} 
      onAdicionarGasto={adicionarGasto} 
      onExcluirGasto={excluirGasto} 
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}