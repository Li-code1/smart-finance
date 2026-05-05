import { useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Wallet, TrendingUp, Trash2, Lightbulb, LogOut, Download } from 'lucide-react';
import { FormularioGasto } from '../components/FormularioGasto';
import { useAuth } from '../context/AuthContext';

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

interface DashboardProps {
  transacoes: Transacao[];
  onAdicionarGasto: (gasto: Omit<Transacao, 'id'>) => void;
  onExcluirGasto: (id: string) => void;
}

export const Dashboard = ({ transacoes, onAdicionarGasto, onExcluirGasto }: DashboardProps) => {
  const { logout } = useAuth();

  // Função para baixar a página inteira como PDF
  const baixarRelatorio = async () => {
    const elemento = document.querySelector('main'); 
    if (!elemento) return;

    const canvas = await html2canvas(elemento as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const larguraPdf = pdf.internal.pageSize.getWidth();
    const alturaPdf = (canvas.height * larguraPdf) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, larguraPdf, alturaPdf);
    pdf.save(`Relatorio_ConsumaMais_${new Date().toLocaleDateString()}.pdf`);
  };

  const analise = useMemo(() => {
    const total = transacoes.reduce((acc, t) => acc + t.valor, 0);
    const agrupado = transacoes.reduce((acc: Record<string, number>, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {});

    const dadosPizza = Object.entries(agrupado).map(([name, value]) => ({ name, value }));
    const dominante = dadosPizza.length > 0 
      ? dadosPizza.reduce((prev, curr) => (prev.value > curr.value ? prev : curr))
      : { name: 'Nenhum', value: 0 };

    const dadosProjecao = Array.from({ length: 6 }, (_, i) => ({
      mes: `Mês ${i + 1}`,
      atual: total,
      comEconomia: total * 0.85 
    }));

    return { total, dadosPizza, dominante, dadosProjecao };
  }, [transacoes]);

  const CORES = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <main className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-left">Consuma+</h1>
          <p className="text-slate-500 font-medium text-left">Consumer Insight Intelligence</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={baixarRelatorio}
            className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-all font-bold"
          >
            <Download size={18} /> Baixar Relatório
          </button>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-bold"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </header>

      <FormularioGasto onAdicionar={onAdicionarGasto} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 rounded-2xl bg-white shadow-sm border-b-4 border-indigo-500">
          <p className="text-sm text-gray-500 font-medium text-left">Saldo de Gastos</p>
          <h3 className="text-2xl font-bold text-gray-800 flex justify-between items-center mt-1">
            R$ {analise.total.toFixed(2)} <Wallet className="text-indigo-500" />
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm border-b-4 border-orange-500">
          <p className="text-sm text-gray-500 font-medium text-left">Foco de Consumo</p>
          <h3 className="text-xl font-bold text-gray-800 flex justify-between items-center mt-1">
            {analise.dominante.name} <TrendingUp className="text-orange-500" />
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-indigo-600 text-white shadow-lg">
          <p className="text-sm text-indigo-100 font-medium text-left">Economia Sugerida (15%)</p>
          <h3 className="text-2xl font-bold flex justify-between items-center mt-1">
            R$ {(analise.total * 0.15).toFixed(2)} <Lightbulb className="text-yellow-300" />
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm h-[400px]">
          <h2 className="text-lg font-bold mb-4 text-left">Composição</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analise.dadosPizza} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name">
                {analise.dadosPizza.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm h-[400px]">
          <h2 className="text-lg font-bold mb-4 text-left">Metas de Economia</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analise.dadosProjecao}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="atual" name="Cenário Atual" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comEconomia" name="Meta Inteligente" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-left">Histórico Recente</h2>
        {transacoes.map(t => (
          <div key={t.id} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
            <div className="text-left">
              <p className="font-bold text-slate-800">{t.descricao}</p>
              <p className="text-xs text-slate-400 uppercase font-bold">{t.categoria}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-indigo-600">R$ {t.valor.toFixed(2)}</span>
              <button onClick={() => onExcluirGasto(t.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};