import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ChatWindow from "../components/ChatWindow";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [myPetId, setMyPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Carga inicial de datos al entrar a la pantalla de Matches
  useEffect(() => {
    const fetchMatches = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const myPetsRes = await axios.get(
          "http://localhost:3005/api/pets/my-pets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          },
        );

        if (myPetsRes.data.length > 0) {
          const petId = myPetsRes.data[0]._id;
          setMyPetId(petId);

          const matchRes = await axios.get(
            `http://localhost:3005/api/matches/${petId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
              },
            },
          );
          setMatches(matchRes.data);
        }
      } catch (error) {
        console.error("Error al obtener matches", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-20 text-brand-purple font-bold text-xl animate-pulse">
        Buscando tus matches... 🐾
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 relative">
      {/* 
        Ventana de Chat Flotante
        *
        *
        * 
        TODO(Futuro): Añadir notificaciones push o un punto rojo cuando haya mensajes nuevos.
      */}
      {selectedMatch && (
        <ChatWindow
          match={selectedMatch}
          myPetId={myPetId}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Tus Matches 💖</h1>
        <p className="text-gray-500 mt-2">
          ¡Mascotas que también quieren jugar contigo!
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-soft text-center max-w-md mx-auto">
          <span className="text-6xl block mb-4">😿</span>
          <h2 className="text-xl font-bold text-gray-700">
            Aún no tienes matches
          </h2>
          <p className="text-gray-500 mt-2">
            Ve a la pestaña de Explorar y dale like a las mascotas que te
            gusten.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {matches.map((match, i) => (
            <motion.div
              key={match._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedMatch(match)}
              className="bg-white hover:bg-red-100 rounded-3xl p-4 shadow-lg cursor-pointer transition-all transform hover:-translate-y-1 flex flex-col items-center border border-transparent hover:shadow-[0_0_40px_rgba(239,68,68,0.9)]"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-inner mb-3 border-4 border-white relative">
                <img
                  src={
                    match.toPet?.photos?.[0] ||
                    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80"
                  }
                  alt={match.toPet?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {match.toPet?.name}
              </h3>
              <p className="text-sm text-brand-pink font-medium">
                ¡Nuevo Match!
              </p>

              <button className="mt-4 px-4 py-2 bg-gray-50 text-brand-purple rounded-full text-sm font-bold hover:bg-brand-purple hover:text-white transition-colors w-full">
                Chatear 💬
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
