import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBone, faArrowRightToBracket, faPaw } from "@fortawesome/free-solid-svg-icons";

const funnyMessages = [
    "Parece que tu mascota olfateó un rastro equivocado...",
    "¡Guau! Cavamos demasiado profundo y no encontramos la página.",
    "Miau... Este enlace cayó de la mesa y se perdió.",
    "Error 404: El hueso que buscas fue enterrado en otro patio."
];

const funnyImages = [
    "https://images.unsplash.com/photo-1537151608804-ea6f11030311?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // perro sorprendido
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // pug asustado
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // gato asomado
    "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"  // gato loco
];

const NotFound = () => {
    const [randomMsg, setRandomMsg] = useState('');
    const [randomImg, setRandomImg] = useState('');
    const [isBouncing, setIsBouncing] = useState(false);

    useEffect(() => {
        setRandomMsg(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
        setRandomImg(funnyImages[Math.floor(Math.random() * funnyImages.length)]);
    }, []);

    const playWithPet = () => {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 500);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl max-w-5xl mx-auto my-8 p-8 text-center relative overflow-hidden">
            {/* Fondo con huesos giratorios */}
            <div className={`absolute -top-10 -left-10 text-purple-500/10 text-9xl transition-transform duration-700 ${isBouncing ? 'rotate-180 scale-125' : '-rotate-12'}`}>
                <FontAwesomeIcon icon={faBone} />
            </div>
            <div className={`absolute -bottom-10 -right-10 text-pink-500/10 text-9xl transition-transform duration-700 ${isBouncing ? '-rotate-180 scale-125' : 'rotate-12'}`}>
                <FontAwesomeIcon icon={faBone} />
            </div>

            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2 animate-pulse">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">¡Página extraviada!</h2>
                
                <p className="text-gray-600 text-lg md:text-xl max-w-md mb-8 h-14 italic">
                    "{randomMsg}"
                </p>

                {/* Imagen aleatoria con interacción */}
                <div 
                    onClick={playWithPet}
                    className={`w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-purple-50 shadow-2xl mb-6 cursor-pointer transition-transform duration-300 ${isBouncing ? '-translate-y-6 scale-110' : 'hover:scale-105 hover:rotate-3'}`}
                    title="¡Hazme clic para jugar!"
                >
                    <img 
                        src={randomImg} 
                        alt="Mascota extraviada" 
                        className="w-full h-full object-cover"
                    />
                </div>

                <p className="text-xs text-gray-400 mb-8 font-semibold uppercase tracking-widest">(¡Haz clic en la foto!)</p>

                {/* Botones funcionales */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link to="/explorar" className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-3">
                        <FontAwesomeIcon icon={faPaw} className="text-pink-400" />
                        Ir a Explorar
                    </Link>
                    
                    <Link to="/login" className="bg-white border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 text-purple-700 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3">
                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                        Ir al Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
