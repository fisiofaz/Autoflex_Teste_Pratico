import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function Recipe() {
    const { productId } = useParams(); 
    const [product, setProduct] = useState(null);
    const [allMaterials, setAllMaterials] = useState([]); 
    const [recipe, setRecipe] = useState([]); 

    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [quantity, setQuantity] = useState('');

    // 1. CARREGAR DADOS INICIAIS (Protegido dentro do useEffect)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Busca Produto
                const prodResponse = await api.get('/products'); 
                const found = prodResponse.data.find(p => p.id == productId);
                setProduct(found);

                // Busca Matérias-Primas
                const matResponse = await api.get('/raw-materials');
                setAllMaterials(matResponse.data);

                // Busca Receita Atual
                const compResponse = await api.get('/compositions');
                const myRecipe = compResponse.data.filter(c => c.product.id == productId);
                setRecipe(myRecipe);

            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        };

        loadInitialData();
    }, [productId]); // Roda sempre que o ID na URL mudar

    // 2. ADICIONAR INGREDIENTE
    async function handleAddIngredient(e) {
        e.preventDefault();
        if(!selectedMaterial || !quantity) return;

        try {
            // Salva no Backend
            await api.post('/compositions', {
                product: { id: productId },
                rawMaterial: { id: selectedMaterial },
                quantityRequired: parseFloat(quantity)
            });
            
            alert("Ingrediente adicionado!");
            setQuantity('');
            
            // ATUALIZA A LISTA NA HORA (Refaz a busca da receita)
            const compResponse = await api.get('/compositions');
            const myRecipe = compResponse.data.filter(c => c.product.id == productId);
            setRecipe(myRecipe);

        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar ingrediente! Verifique o console.");
        }
    }

    if (!product) return <div className="p-8 text-center text-gray-500">Carregando produto...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link to="/products" className="text-indigo-600 hover:underline mb-4 block">← Voltar para Produtos</Link>
            
            <h1 className="text-3xl font-bold text-indigo-800 mb-2">Receita: {product.name}</h1>
            <p className="text-gray-600 mb-8">Defina quais ingredientes compõem este produto.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* ESQUERDA: ADICIONAR NOVO */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-bold mb-4">Adicionar Ingrediente</h2>
                    <form onSubmit={handleAddIngredient} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Matéria-Prima</label>
                            <select 
                                value={selectedMaterial}
                                onChange={e => setSelectedMaterial(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 border p-2 bg-white"
                                required
                            >
                                <option value="">Selecione...</option>
                                {allMaterials.map(m => (
                                    <option key={m.id} value={m.id}>{m.name} (Estoque: {m.stockQuantity})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantidade Necessária</label>
                            <input 
                                type="number" 
                                step="0.001"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 border p-2"
                                placeholder="Qtd usada nesse produto"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                            Adicionar à Receita
                        </button>
                    </form>
                </div>

                {/* DIREITA: LISTA ATUAL */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Ingredientes Atuais</h2>
                    {recipe.length === 0 ? (
                        <p className="text-gray-500 italic">Nenhum ingrediente cadastrado.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {recipe.map(item => (
                                <li key={item.id} className="py-3 flex justify-between">
                                    <span className="font-medium">{item.rawMaterial.name}</span>
                                    <span className="text-gray-600 font-bold">{item.quantityRequired} un.</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}