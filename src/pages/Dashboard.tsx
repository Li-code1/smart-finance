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

  const baixarRelatorio = async () => {
    const elemento = document.querySelector('main'); 
    if (!elemento) return;

    const estiloOriginal = elemento.style.width;
    elemento.style.width = '1280px'; 

    const canvas = await html2canvas(elemento as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 1280,
      width: 1280,
      scrollX: 0,
      scrollY: -window.scrollY
    });
    
    elemento.style.width = estiloOriginal;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const larguraPdf = pdf.internal.pageSize.getWidth();
    const alturaPdf = (canvas.height * larguraPdf) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, larguraPdf, alturaPdf);
    pdf.save(`Relatorio_ConsumaMais_${new Date().toLocaleDateString()}.pdf`);
  };

  const analise = useMemo(() => {
    // Cálculo dinâmico: o total é recalculado a cada mudança nas transações
    const totalAtual = transacoes.reduce((acc, t) => acc + t.valor, 0);
    const economiaMensal = totalAtual * 0.15; 

    const agrupado = transacoes.reduce((acc: Record<string, number>, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {});

    const dadosPizza = Object.entries(agrupado).map(([name, value]) => ({ name, value }));
    const dominante = dadosPizza.length > 0 
      ? dadosPizza.reduce((prev, curr) => (prev.value > curr.value ? prev : curr))
      : { name: 'Nenhum', value: 0 };

    // Projeção Dinâmica: As barras de 1 a 6 meses "sobem" ou "descem" na hora
    const dadosProjecao = Array.from({ length: 6 }, (_, i) => {
      const meses = i + 1;
      return {
        mes: `${meses}º Mês`,
        // Reflete o acúmulo baseado no seu gasto atual em tempo real
        gastoAcumulado: parseFloat((totalAtual * meses).toFixed(2)),
        // Reflete a reserva baseada no seu gasto atual em tempo real
        reservaAcumulada: parseFloat((economiaMensal * meses).toFixed(2))
      };
    });

    return { totalAtual, dadosPizza, dominante, dadosProjecao, economiaMensal };
  }, [transacoes]); // A dependência [transacoes] garante a atualização instantânea

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
          <p className="text-sm text-gray-500 font-medium text-left">Gasto Mensal Total</p>
          <h3 className="text-2xl font-bold text-gray-800 flex justify-between items-center mt-1">
            R$ {analise.totalAtual.toFixed(2)} <Wallet className="text-indigo-500" />
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm border-b-4 border-orange-500">
          <p className="text-sm text-gray-500 font-medium text-left">Foco de Consumo</p>
          <h3 className="text-xl font-bold text-gray-800 flex justify-between items-center mt-1">
            {analise.dominante.name} <TrendingUp className="text-orange-500" />
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-indigo-600 text-white shadow-lg">
          <p className="text-sm text-indigo-100 font-medium text-left">Meta de Poupança (15%)</p>
          <h3 className="text-2xl font-bold flex justify-between items-center mt-1">
            R$ {analise.economiaMensal.toFixed(2)} <Lightbulb className="text-yellow-300" />
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm h-[400px]">
          <h2 className="text-lg font-bold mb-4 text-left">Composição por Categoria</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analise.dadosPizza} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name">
                {analise.dadosPizza.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm h-[400px]">
          <h2 className="text-lg font-bold mb-4 text-left">Projeção Semestral Acumulada</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analise.dadosProjecao}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="gastoAcumulado" name="Total Gasto (Acumulado)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reservaAcumulada" name="Total Poupatudo (Acumulado)" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-left">Extrato de Movimentações</h2>
        {transacoes.map(t => (
          <div key={t.id} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
            <div className="text-left">
              <p className="font-bold text-slate-800">{t.descricao}</p>
              <div className="flex gap-2 items-center">
                <p className="text-xs text-slate-400 uppercase font-bold">{t.categoria}</p>
                <span className="text-[10px] text-slate-400">•</span>
                <p className="text-xs text-slate-400 font-medium">
                  {new Date(t.data).toLocaleDateString('pt-BR')}
                </p>
              </div>
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