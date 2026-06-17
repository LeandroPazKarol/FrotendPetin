import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); 

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="relative bg-white shadow-sm z-50">
      <div className="flex justify-between items-center py-4 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-brand flex items-center justify-center text-white font-bold">
            🐾
          </div>
          <span className="text-xl font-bold text-brand-purple">Pettin</span>
        </div>

        <button 
          className="md:hidden text-2xl text-brand-purple focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✖' : '☰'}
        </button>

  
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600 items-center">
          <Link to="/explorar" className="hover:text-brand-purple transition-colors">🏠 Explorar</Link>
          <Link to="/matches" className="hover:text-brand-purple transition-colors">💖 Matches</Link>
          <Link to="/perfil" className="hover:text-brand-purple transition-colors">👤 Perfil</Link>
          
          <button 
            onClick={handleLogout}
            className="bg-gradient-brand px-5 py-2 text-white rounded-full font-medium hover:opacity-90 shadow-soft transition-all"
          >
            Salir
          </button>
        </div>
      </div>


      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col gap-4 text-gray-600 font-medium">
          <Link to="/explorar" onClick={() => setIsOpen(false)} className="hover:text-brand-purple">🏠 Explorar</Link>
          <Link to="/matches" onClick={() => setIsOpen(false)} className="hover:text-brand-purple">💖 Matches</Link>
          <Link to="/perfil" onClick={() => setIsOpen(false)} className="hover:text-brand-purple">👤 Perfil</Link>
          <hr className="border-gray-100" />
          <button 
            onClick={handleLogout}
            className="text-left text-red-500 hover:text-red-600 font-bold"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
