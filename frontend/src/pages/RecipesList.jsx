import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function RecipesList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data));
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-indigo-900">Livro de Receitas</h1>
                    <p className="text-gray-500 mt-1">Gerencie a composição técnica de cada produto.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
                                    R$ {product.price.toFixed(2)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Clique abaixo para definir os ingredientes e quantidades.
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 border-t border-gray-100">
                            <Link 
                                to={`/recipe/${product.id}`}
                                className="block w-full text-center bg-white border border-indigo-200 text-indigo-700 font-bold py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                            >
                                📝 Editar Receita
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}