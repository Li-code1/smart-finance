import { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabaseClient';

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

function AppContent() {
  const { logado, carregando } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(false);

  // Carrega as transações do Supabase (a RLS garante que só vêm as do usuário logado)
  useEffect(() => {
    if (!logado) {
      setTransacoes([]);
      return;
    }

    setCarregandoDados(true);
    supabase
      .from('transacoes')
      .select('id, descricao, valor, categoria, data')
      .order('data', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Erro ao carregar transações:', error.message);
        } else {
          setTransacoes(data ?? []);
        }
        setCarregandoDados(false);
      });
  }, [logado]);

  const adicionarGasto = async (novoGasto: Omit<Transacao, 'id'>) => {
    const { data, error } = await supabase
      .from('transacoes')
      .insert(novoGasto)
      .select('id, descricao, valor, categoria, data')
      .single();

    if (error) {
      console.error('Erro ao adicionar gasto:', error.message);
      alert('Não foi possível salvar o gasto. Tente novamente.');
      return;
    }

    setTransacoes(prev => [data, ...prev]);
  };

  const excluirGasto = async (id: string) => {
    const { error } = await supabase.from('transacoes').delete().eq('id', id);

    if (error) {
      console.error('Erro ao excluir gasto:', error.message);
      alert('Não foi possível excluir o gasto. Tente novamente.');
      return;
    }

    setTransacoes(prev => prev.filter(t => t.id !== id));
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500 font-bold">Carregando...</p>
      </div>
    );
  }

  if (!logado) return <Login />;

  return (
    <Dashboard
      transacoes={transacoes}
      carregando={carregandoDados}
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
