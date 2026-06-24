import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
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
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-white/90 md:shadow-lg md:shadow-purple-300 md:border-b-2 md:border-purple-100">
        {/* Logo */}
        <div className="flex justify-start items-center gap-2">
          <div className="w-10 h-10 rounded bg-gradient-brand flex items-center justify-center text-white font-bold">
            <span className="[text-shadow:0_0_4px_#fff] text-2xl">🐾</span>
          </div>
          <span className="text-xl font-bold text-brand-purple">Pettin</span>
        </div>

        {/* Desktop Navigation and Logout */}
        <div className="hidden md:flex flex-1 justify-between items-center ml-10">
          <div className="flex-1 flex justify-center gap-8 text-md font-medium text-gray-600">
            <Link to="/explorar" className="hover:text-brand-purple transition-colors">🏠 Explorar</Link>
            <Link to="/matches" className="hover:text-brand-purple transition-colors">💖 Matches</Link>
            <Link to="/perfil" className="hover:text-brand-purple transition-colors">👤 Perfil</Link>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-gradient-brand px-5 py-2 text-white rounded-full font-medium hover:opacity-90 shadow-soft transition-all"
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="cursor-pointer hover:opacity-90 mr-2"
            />
            Salir
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-2xl text-brand-purple focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✖' : '☰'}
        </button>


      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full backdrop-blur-md bg-white/90 shadow-lg py-4 px-6 flex flex-col gap-4 text-gray-600 font-medium">
          <Link to="/explorar" onClick={() => setIsOpen(false)} className="hover:text-brand-purple p-2 transition-all duration-500">🏠 Explorar</Link>
          <Link to="/matches" onClick={() => setIsOpen(false)} className="hover:text-brand-purple p-2 transition-all duration-500">💖 Matches</Link>
          <Link to="/perfil" onClick={() => setIsOpen(false)} className="hover:text-brand-purple p-2 transition-all duration-500">👤 Perfil</Link>
          <hr className="border-gray-100" />
          <button 
            onClick={handleLogout}
            className="text-left text-red-500 text-base font-bold hover:font-extrabold p-2"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
