import { useState } from 'react'; // <--- IMPORTANTE: Adicionei useState
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

import Products from './pages/Products';
import RawMaterials from './pages/RawMaterials';
import Recipe from './pages/Recipe';
import RecipesList from './pages/RecipesList';
import Planning from './pages/Planning';

// Componente de Link para Desktop
function NavLink({ to, children, active }) {
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-md font-medium transition-all ${
        active 
          ? 'bg-indigo-700 text-white shadow-md' 
          : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

// Componente de Link para Mobile (Botão grande)
function MobileNavLink({ to, children, active, onClick }) {
    return (
      <Link 
        to={to} 
        onClick={onClick}
        className={`block px-4 py-3 rounded-md text-base font-medium border-b border-indigo-700 ${
          active 
            ? 'bg-indigo-800 text-white' 
            : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
        }`}
      >
        {children}
      </Link>
    );
  }

function NavBar() {
  const location = useLocation();
  const path = location.pathname;
  
  // Estado para controlar o menu mobile (Aberto/Fechado)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para fechar o menu ao clicar em um link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white shadow-lg relative z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl">🏭</span>
            <Link to="/" className="font-bold text-xl tracking-tight" onClick={closeMenu}>
                Autoflex<span className="text-indigo-300">Control</span>
            </Link>
          </div>
          
          {/* MENU DESKTOP (Somente visível em telas médias pra cima 'md:flex') */}
          <div className="hidden md:flex space-x-2">
            <NavLink to="/products" active={path === '/products'}>📦 Produtos</NavLink>
            <NavLink to="/raw-materials" active={path === '/raw-materials'}>🧪 Insumos</NavLink>
            <NavLink to="/recipes-list" active={path === '/recipes-list' || path.includes('/recipe/')}>📜 Receitas</NavLink>
            <NavLink to="/planning" active={path === '/planning'}>📊 Planejamento</NavLink>
          </div>

          {/* BOTÃO HAMBURGUER (Somente visível em celular 'md:hidden') */}
          <div className="md:hidden flex items-center">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-indigo-200 hover:text-white focus:outline-none p-2"
            >
                {isMenuOpen ? (
                    // Ícone de Fechar (X)
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    // Ícone de Menu (Três riscos)
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE (Dropdown) */}
      {/* Só aparece se isMenuOpen for true */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-900 border-t border-indigo-700 shadow-xl animate-fade-in absolute w-full left-0">
            <div className="px-2 pt-2 pb-3 space-y-1">
                <MobileNavLink to="/products" onClick={closeMenu} active={path === '/products'}>
                    📦 Produtos
                </MobileNavLink>
                <MobileNavLink to="/raw-materials" onClick={closeMenu} active={path === '/raw-materials'}>
                    🧪 Matérias-Primas
                </MobileNavLink>
                <MobileNavLink to="/recipes-list" onClick={closeMenu} active={path === '/recipes-list' || path.includes('/recipe/')}>
                    📜 Receitas
                </MobileNavLink>
                <MobileNavLink to="/planning" onClick={closeMenu} active={path === '/planning'}>
                    📊 Planejamento
                </MobileNavLink>
            </div>
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
        <NavBar />

        <main className="py-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center mt-10 p-8 animate-fade-in px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-4">Bem-vindo ao Sistema de Produção</h1>
                <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Gerencie seu estoque, defina receitas técnicas e deixe nossa inteligência artificial calcular o melhor plano de produção.
                </p>
                <Link to="/planning" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-lg inline-block">
                  Começar Planejamento 🚀
                </Link>
              </div>
            } />
            
            <Route path="/products" element={<Products />} />
            <Route path="/raw-materials" element={<RawMaterials />} />
            <Route path="/recipes-list" element={<RecipesList />} />
            <Route path="/recipe/:productId" element={<Recipe />} />
            <Route path="/planning" element={<Planning />} />
          </Routes>
        </main>
        
        <footer className="text-center py-6 text-gray-400 text-sm">
          &copy; 2026 Autoflex Challenge - Desenvolvido por Você
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;