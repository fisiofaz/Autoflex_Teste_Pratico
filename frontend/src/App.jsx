import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products';
import RawMaterials from './pages/RawMaterials';
import Recipe from './pages/Recipe';

function App() {
  return (
    <BrowserRouter>
      {/* MENU DE NAVEGAÇÃO SUPERIOR */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-4xl mx-auto flex gap-6">
          <Link to="/" className="hover:text-gray-300 font-bold">Autoflex Control</Link>
          <Link to="/products" className="hover:text-gray-300">Produtos</Link>
          <Link to="/raw-materials" className="hover:text-gray-300 text-gray-500 cursor-not-allowed">Matérias-Primas</Link>
          <Link to="/planning" className="hover:text-gray-300 text-gray-500 cursor-not-allowed">Planejamento</Link>
        </div>
      </nav>

      {/* ÁREA ONDE AS TELAS APARECEM */}
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<h1 className="text-center mt-10 text-2xl">Bem-vindo ao Sistema!</h1>} />
          <Route path="/products" element={<Products />} />
          <Route path="/raw-materials" element={<RawMaterials />} />
          <Route path="/recipe/:productId" element={<Recipe />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;