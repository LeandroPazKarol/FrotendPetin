
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBone } from "@fortawesome/free-solid-svg-icons";

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl max-w-5xl mx-auto my-8 p-8 text-center relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute -top-10 -left-10 text-brand-purple/10 text-9xl transform -rotate-12">
                <FontAwesomeIcon icon={faBone} />
            </div>
            <div className="absolute -bottom-10 -right-10 text-pink-500/10 text-9xl transform rotate-12">
                <FontAwesomeIcon icon={faBone} />
            </div>

            {/* Contenido Principal */}
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-brand mb-2">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">¡Ups! Nos perdimos del camino</h2>
                <p className="text-gray-500 text-lg max-w-md mb-8">
                    Parece que tu mascota olfateó un rastro equivocado y terminamos en una página que no existe.
                </p>

                {/* Imagen divertida */}
                <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-purple-50 shadow-lg mb-8">
                    <img 
                        src="https://images.unsplash.com/photo-1537151608804-ea6f11030311?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Perro confundido" 
                        className="w-full h-full object-cover"
                    />
                </div>

                <Link to="/" className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center gap-3">
                    <FontAwesomeIcon icon={faHouse} />
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
