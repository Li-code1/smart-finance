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

  // Consumo da API Local (Requisito: Dados simulados/reais)
  useEffect(() => {
    if (logado) {
      fetch('http://localhost:3001/transacoes')
        .then(res => {
          if (!res.ok) throw new Error("Erro ao buscar dados");
          return res.json();
        })
        .then(data => setTransacoes(data))
        .catch(err => console.error("Erro na API:", err));
    }
  }, [logado]);

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
      }
    } catch (err) {
      console.error("Erro ao adicionar:", err);
    }
  };

  const excluirGasto = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/transacoes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTransacoes(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
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