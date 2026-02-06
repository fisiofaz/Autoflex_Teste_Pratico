import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Products() {
    // ESTADOS
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    // BUSCAR DADOS 
    useEffect(() => {
        // Definimos a função AQUI DENTRO para evitar erros do React
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                // Não colocamos alert aqui para não spamar o usuário se a conexão cair
            }
        };

        fetchProducts(); // Chamamos ela imediatamente
    }, []); 

    // 3. SALVAR
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await api.post('/products', {
                name: name,
                price: parseFloat(price)
            });
            
            // Limpa campos
            setName('');
            setPrice('');
            
            // Atualiza a lista manualmente chamando a API de novo
            const response = await api.get('/products');
            setProducts(response.data);
            
            alert("Produto salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar produto!");
        }
    }

    // DELETAR
    async function handleDelete(id) {
        if(confirm("Tem certeza que quer excluir?")) {
            try {
                await api.delete(`/products/${id}`);
                // Atualiza a lista
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Erro ao excluir produto!");
            }
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-indigo-600">Gerenciar Produtos</h1>

            {/* FORMULÁRIO */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required 
                    />
                </div>
                <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700">Preço</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        required 
                    />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                    Salvar
                </button>
            </form>

            {/* LISTA */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">R$ {product.price?.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link 
                                        to={`/recipe/${product.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 font-bold"
                                    >
                                        Receita
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900 font-bold"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}