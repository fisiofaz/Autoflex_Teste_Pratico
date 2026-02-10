import { useState } from 'react';
import api from '../services/api';

export default function Planning() {
    const [plan, setPlan] = useState([]);
    const [loading, setLoading] = useState(false);
    const [calculated, setCalculated] = useState(false);

    async function handleCalculate() {
        setLoading(true);
        try {
            const response = await api.get('/planning');
            setPlan(response.data);
            setCalculated(true);
        } catch (error) {
            console.error("Erro", error);
            alert("Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    }

    const totalRevenue = plan.reduce((acc, item) => acc + item.totalValue, 0);

    return (
        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-indigo-900">Planejamento de Produção</h1>
                <p className="text-gray-500 mt-2">Algoritmo de Otimização de Lucro Baseado em Estoque Real</p>
            </div>

            {/* CARD DE AÇÃO */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 flex flex-col items-center justify-center mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Simulação de Cenário</h2>
                <p className="text-gray-500 mb-6 text-center max-w-lg">
                    O sistema analisará todo o estoque disponível e priorizará a fabricação dos produtos de 
                    <span className="font-bold text-indigo-600"> maior valor agregado</span>.
                </p>

                <button 
                    onClick={handleCalculate} 
                    disabled={loading}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                >
                    {loading ? (
                        <>🔄 Processando Dados...</>
                    ) : (
                        <>⚡ Calcular Melhor Produção</>
                    )}
                </button>
            </div>

            {/* RESULTADOS */}
            {calculated && (
                <div className="animate-fade-in-up">
                    {plan.length === 0 ? (
                        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
                            <h3 className="text-xl font-bold mb-1">⚠️ Estoque Crítico</h3>
                            <p>Não há insumos suficientes para produzir nenhum item do catálogo.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* KIP de Lucro */}
                            <div className="md:col-span-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg flex justify-between items-center">
                                <div>
                                    <p className="text-green-100 font-medium">Receita Bruta Estimada</p>
                                    <h3 className="text-4xl font-bold">R$ {totalRevenue.toFixed(2)}</h3>
                                </div>
                                <div className="text-5xl opacity-30">💰</div>
                            </div>

                            {/* Tabela de Produtos */}
                            <div className="md:col-span-3 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Produto Sugerido</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Quantidade</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {plan.map((item, index) => (
                                            <tr key={index} className="hover:bg-indigo-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-800 text-lg">
                                                    {item.productName}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-bold text-lg">
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-green-600 text-lg">
                                                    R$ {item.totalValue.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}