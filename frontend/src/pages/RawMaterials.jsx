import { useState, useEffect } from 'react';
import api from '../services/api';

export default function RawMaterials() {
    const [materials, setMaterials] = useState([]);
    const [name, setName] = useState('');
    const [stock, setStock] = useState('');
    
    // Estado para controlar a Edição (Se tiver ID, estamos editando. Se null, criando)
    const [editingId, setEditingId] = useState(null);

    // 1. CARREGAR LISTA
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await api.get('/raw-materials');
                setMaterials(response.data);
            } catch (error) {
                console.error("Erro ao carregar matérias:", error);
            }
        };
        fetchMaterials();
    }, []);

    // 2. SALVAR (Adicionar OU Atualizar)
    async function handleSubmit(event) {
        event.preventDefault();
        
        try {
            if (editingId) {
                // --- MODO EDIÇÃO (PUT) ---
                await api.put(`/raw-materials/${editingId}`, {
                    name: name,
                    stockQuantity: parseFloat(stock)
                });
                alert("Atualizado com sucesso!");
            } else {
                // --- MODO CRIAÇÃO (POST) ---
                await api.post('/raw-materials', {
                    name: name,
                    stockQuantity: parseFloat(stock)
                });
                alert("Cadastrado com sucesso!");
            }

            // Limpa tudo e recarrega
            cleanForm();
            refreshList();

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar! Verifique se o Backend suporta essa operação.");
        }
    }

    // 3. PREPARAR PARA EDITAR (Joga os dados no formulário)
    function handleEdit(material) {
        setEditingId(material.id);
        setName(material.name);
        setStock(material.stockQuantity);
    }

    // 4. EXCLUIR
    async function handleDelete(id) {
        if (confirm("Tem certeza que quer excluir? Se este item estiver em uma receita, pode dar erro.")) {
            try {
                await api.delete(`/raw-materials/${id}`);
                refreshList();
            } catch (error) {
                console.error(error);
                alert("Erro ao excluir! Talvez este item esteja sendo usado em uma receita.");
            }
        }
    }

    // 5. CANCELAR EDIÇÃO
    function cleanForm() {
        setEditingId(null);
        setName('');
        setStock('');
    }

    // Auxiliar para recarregar a lista
    async function refreshList() {
        const response = await api.get('/raw-materials');
        setMaterials(response.data);
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-green-700">Estoque de Matérias-Primas</h1>

            {/* FORMULÁRIO INTELIGENTE */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 items-end border-l-4 border-green-500">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Nome do Insumo</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        placeholder="Ex: Farinha"
                        required 
                    />
                </div>
                <div className="w-40">
                    <label className="block text-sm font-medium text-gray-700">Qtd. Estoque</label>
                    <input 
                        type="number" 
                        step="0.001"
                        value={stock}
                        onChange={e => setStock(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        placeholder="0.00"
                        required 
                    />
                </div>
                
                {/* Botões do Formulário */}
                <div className="flex gap-2">
                    <button 
                        type="submit" 
                        className={`px-4 py-2 rounded-md text-white transition shadow-sm ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {editingId ? 'Atualizar' : 'Adicionar'}
                    </button>
                    
                    {editingId && (
                        <button 
                            type="button" 
                            onClick={cleanForm}
                            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* LISTA */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                                    {item.stockQuantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                    <button 
                                        onClick={() => handleEdit(item)}
                                        className="text-blue-600 hover:text-blue-900 font-bold"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
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