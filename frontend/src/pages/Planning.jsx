import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Planning() {
    // ESTADOS
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    
    // RESULTADO DO CÁLCULO
    const [planResult, setPlanResult] = useState(null);

    // CARREGAR LISTA DE PRODUTOS (Para o Select)
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao carregar produtos", error);
            }
        };
        loadProducts();
    }, []);

    // A MÁGICA: CALCULAR PRODUÇÃO
    async function handleCalculate(e) {
        e.preventDefault();
        if (!selectedProductId || !quantity) return;

        try {
            // Buscamos dados atualizados do servidor
            // (Precisamos do Estoque atual e da Receita atual)
            const [materialsRes, compositionsRes] = await Promise.all([
                api.get('/raw-materials'),
                api.get('/compositions')
            ]);

            const allMaterials = materialsRes.data;
            const allCompositions = compositionsRes.data;

            // Filtramos a receita do produto escolhido
            const productRecipe = allCompositions.filter(c => c.product.id == selectedProductId);

            if (productRecipe.length === 0) {
                alert("Este produto não tem receita cadastrada! Vá em Produtos -> Receita.");
                setPlanResult(null);
                return;
            }

            // Fazemos a matemática
            let isViable = true;
            const detailedAnalysis = productRecipe.map(item => {
                const material = allMaterials.find(m => m.id === item.rawMaterial.id);
                
                const totalRequired = item.quantityRequired * parseFloat(quantity);
                const currentStock = material ? material.stockQuantity : 0;
                const missing = currentStock < totalRequired;

                if (missing) isViable = false;

                return {
                    materialName: material ? material.name : 'Desconhecido',
                    requiredUnit: item.quantityRequired,
                    totalRequired: totalRequired,
                    currentStock: currentStock,
                    status: missing ? 'FALTA ESTOQUE' : 'OK'
                };
            });

            // Salvamos o resultado para exibir na tela
            setPlanResult({
                isViable,
                details: detailedAnalysis
            });

        } catch (error) {
            console.error(error);
            alert("Erro ao calcular planejamento.");
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-yellow-700">Planejamento de Produção</h1>

            {/* ÁREA DE ENTRADA */}
            <form onSubmit={handleCalculate} className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 items-end border-l-4 border-yellow-500">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">O que vamos produzir?</label>
                    <select 
                        value={selectedProductId}
                        onChange={e => setSelectedProductId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 border p-2 bg-white"
                        required
                    >
                        <option value="">Selecione um produto...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (R$ {p.price.toFixed(2)})</option>
                        ))}
                    </select>
                </div>
                <div className="w-40">
                    <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                    <input 
                        type="number" 
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 border p-2"
                        placeholder="Ex: 10"
                        min="1"
                        required
                    />
                </div>
                <button type="submit" className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 font-bold transition">
                    CALCULAR
                </button>
            </form>

            {/* RESULTADO (Só aparece depois de calcular) */}
            {planResult && (
                <div className="animate-fade-in">
                    {/* PLACA DE STATUS */}
                    <div className={`p-4 rounded-lg mb-6 text-center text-xl font-bold border-2 ${
                        planResult.isViable 
                            ? 'bg-green-100 text-green-800 border-green-500' 
                            : 'bg-red-100 text-red-800 border-red-500'
                    }`}>
                        {planResult.isViable 
                            ? `✅ PRODUÇÃO APROVADA! TEMOS ESTOQUE PARA ${quantity} UNIDADES.` 
                            : `❌ ESTOQUE INSUFICIENTE PARA ${quantity} UNIDADES.`}
                    </div>

                    {/* TABELA DETALHADA */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matéria-Prima</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Necessário Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponível</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {planResult.details.map((item, index) => (
                                    <tr key={index} className={item.status !== 'OK' ? 'bg-red-50' : ''}>
                                        <td className="px-6 py-4 font-medium">{item.materialName}</td>
                                        <td className="px-6 py-4">{item.totalRequired.toFixed(3)}</td>
                                        <td className="px-6 py-4">{item.currentStock.toFixed(3)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                item.status === 'OK' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}