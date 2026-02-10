import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Products() {
    // ESTADOS
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [setFetchError] = useState(null);

    // BUSCAR DADOS 
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchProducts(); // Chamamos ela imediatamente
    }, []); 

    async function loadProducts() {
        setListLoading(true);
        setFetchError(null);
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Erro ao carregar:", error);
            alert("Não foi possível carregar os produtos.");
        } finally {
            setListLoading(false);
        }
    }

    // 3. SALVAR
    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        try {
           if (editingId) {
                // EDITAR (PUT)
                await api.put(`/products/${editingId}`, {
                    name,
                    price: parseFloat(price)
                });
                alert("Produto atualizado!");
            } else {
                // CRIAR (POST)
                await api.post('/products', {
                    name,
                    price: parseFloat(price)
                });
                alert("Produto criado!");
            }
            
            cleanForm();
            loadProducts();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar o produto. Verifique os dados e tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    // DELETAR
    async function handleDelete(id) {
        if(confirm("Tem certeza? Esta ação apagará também a receita associada a este produto.")) {
            setListLoading(true);
            try {
                await api.delete(`/products/${id}`);
                loadProducts();
            } catch (error) {
                console.error(error);
                alert("Erro ao excluir produto!");
                setListLoading(false);
            }
        }
    }

    function handleEdit(product) {
        setEditingId(product.id);
        setName(product.name);
        setPrice(product.price.toString());
    }

    function cleanForm() {
        setEditingId(null);
        setName('');
        setPrice('');
    }

    return (
        <div className="p-8 max-w-6xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-indigo-900">Catálogo de Produtos</h1>
                    <p className="text-gray-500 mt-1">Cadastre e gerencie os produtos que sua empresa fabrica.</p>
                </div>
            </div>

            {/* FORMULÁRIO */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 md:items-end">
                    <div className="flex-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                        <input 
                            type="text" 
                            id='name'
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Ex: Bolo de Chocolate"
                            required 
                        />
                    </div>
                    <div className="w-full md:w-40">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
                        <input 
                            type="number" 
                            id="price"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="0.00"
                            required 
                        />
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <button 
                            type="submit" 
                            className={`px-6 py-2.5 rounded-md text-white font-medium transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${editingId ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} disabled:opacity-50`}
                        >
                            {loading ? (editingId ? 'Atualizando...' : 'Salvando...') : (editingId ? 'Atualizar' : 'Salvar')}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={cleanForm}
                                disabled={loading}
                                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-md hover:bg-gray-300 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                         )}
                    </div>
                </form>
            </div>

            {/* LISTA */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Produtos Cadastrados</h2>
                    <button onClick={loadProducts} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold" title="Recarregar Lista">
                        🔄 Atualizar
                    </button>
                </div>
                {listLoading ? (
                    <div className="p-8 text-center text-gray-500">Carregando produtos...</div>
                ) : products.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p className="mb-2">Nenhum produto cadastrado.</p>
                        <p className="text-sm">Utilize o formulário acima para adicionar o primeiro produto.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {product.price?.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center">
                                        <Link 
                                            to={`/recipe/${product.id}`} 
                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                                            title="Ver/Editar Receita"
                                        >
                                            📜 Receita
                                        </Link>
                                        <button 
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                                            title="Editar Produto"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                                            title="Excluir Produto"
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}                  
            </div>
        </div>
    );
}