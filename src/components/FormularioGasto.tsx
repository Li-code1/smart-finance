import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface FormularioProps {
  onAdicionar: (gasto: { descricao: string; valor: number; categoria: string; data: string }) => void;
}

export const FormularioGasto = ({ onAdicionar }: FormularioProps) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Alimentação');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const valorNumerico = Number.parseFloat(valor);
    
    if (!descricao || Number.isNaN(valorNumerico)) return;
    
    onAdicionar({
      descricao,
      valor: valorNumerico,
      categoria,
      data: new Date().toISOString()
    });

    setDescricao('');
    setValor('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="desc" className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
        <input
          id="desc"
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Ex: Mercado Mensal"
        />
      </div>
      <div className="w-32">
        <label htmlFor="valor" className="block text-sm font-medium text-slate-700 mb-1">Valor</label>
        <input
          id="valor"
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
      <div className="w-48">
        <label htmlFor="cat" className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
        <select
          id="cat"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option>Alimentação</option>
          <option>Lazer</option>
          <option>Transporte</option>
          <option>Água / Luz / Telefone</option>
          <option>Impostos (IPTU/IPVA)</option>
          <option>Condomínio / Aluguel</option>
        </select>
      </div>
      <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 flex gap-2 items-center transition-colors">
        <PlusCircle size={20} /> Adicionar
      </button>
    </form>
  );
};