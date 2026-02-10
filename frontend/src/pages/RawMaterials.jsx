import { useState, useEffect } from 'react';
import api from '../services/api';

export default function RawMaterials() {
    const [materials, setMaterials] = useState([]);
    const [name, setName] = useState('');
    const [stock, setStock] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);

    // 1. CARREGAR LISTA
    useEffect(() => {
        loadMaterials();
    }, []);

    async function loadMaterials() {
        setListLoading(true);
        try {
            const response = await api.get('/raw-materials');
            setMaterials(response.data);
        } catch (error) {
            console.error("Erro ao carregar matérias:", error);
            alert("Erro ao carregar lista de insumos.");
        } finally {
            setListLoading(false);
        }
    }

    // 2. SALVAR (Adicionar OU Atualizar)
    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        
        try {
            if (editingId) {
                // --- MODO EDIÇÃO (PUT) ---
                await api.put(`/raw-materials/${editingId}`, {
                    name: name,
                    stockQuantity: parseFloat(stock)
                });
                // Feedback visual via atualização de lista
            } else {
                // --- MODO CRIAÇÃO (POST) ---
                await api.post('/raw-materials', {
                    name: name,
                    stockQuantity: parseFloat(stock)
                });
            }

            cleanForm();
            loadMaterials();

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar! Verifique a conexão.");
        } finally {
            setLoading(false);
        }
    }

    // 3. PREPARAR PARA EDITAR
    function handleEdit(material) {
        setEditingId(material.id);
        setName(material.name);
        setStock(material.stockQuantity);
    }

    // 4. EXCLUIR
    async function handleDelete(id) {
        if (confirm("Tem certeza que quer excluir? Se este item estiver em uma receita, poderá haver erros de produção.")) {
            setListLoading(true);
            try {
                await api.delete(`/raw-materials/${id}`);
                loadMaterials();
            } catch (error) {
                console.error(error);
                alert("Erro ao excluir! Talvez este item esteja sendo usado em uma receita.");
                setListLoading(false);
            }
        }
    }

    function cleanForm() {
        setEditingId(null);
        setName('');
        setStock('');
    }

    return (
        <div className="p-8 max-w-6xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-emerald-900">Estoque de Insumos</h1>
                    <p className="text-gray-500 mt-1">Gerencie as matérias-primas disponíveis para produção.</p>
                </div>
            </div>

            {/* FORMULÁRIO */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {editingId ? 'Editar Insumo' : 'Novo Insumo'}
                </h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 md:items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Insumo</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            placeholder="Ex: Farinha de Trigo"
                            required 
                        />
                    </div>
                    <div className="w-full md:w-40">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Estoque</label>
                        <input 
                            type="number" 
                            step="0.001"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            placeholder="0.00"
                            required 
                        />
                    </div>
                    
                    {/* Botões de Ação */}
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`px-6 py-2.5 rounded-md text-white font-medium transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                                editingId 
                                    ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                            }`}
                        >
                            {loading ? 'Salvando...' : (editingId ? 'Atualizar' : 'Adicionar')}
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
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Inventário Atual</h2>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                        {materials.length} itens
                    </span>
                </div>

                {listLoading ? (
                    <div className="p-8 text-center text-gray-500">Atualizando estoque...</div>
                ) : materials.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p className="mb-2">Estoque vazio.</p>
                        <p className="text-sm">Cadastre suas matérias-primas acima.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insumo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {materials.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-md font-bold ${
                                            item.stockQuantity <= 0 ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'
                                        }`}>
                                            {item.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                                            title="Editar Estoque"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                                            title="Excluir do Sistema"
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