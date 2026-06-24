import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import PetCard from "../components/PetCard";
import { AnimatePresence, motion } from "framer-motion";

// datos de prueba estáticos.
const DUMMY_PETS = [
  {
    _id: "1",
    name: "Luna",
    age: 2,
    description:
      "Perrita amigable y juguetona que ama caminar y recibir cariño.",
    photos: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
  },
];

const Explorar = () => {
  const [pets, setPets] = useState([]);
  const [myPetId, setMyPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [matchPopup, setMatchPopup] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
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
          setMyPetId(myPetsRes.data[0]._id);
        }

        const res = await axios.get("http://localhost:3005/api/pets", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        });

        if (res.data.length === 0) setPets(DUMMY_PETS);
        else setPets(res.data);
      } catch (error) {
        console.error("Error al obtener datos", error);
        setPets(DUMMY_PETS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSwipe = async (action, toPetId) => {
    if (!myPetId) {
      alert(
        "Primero debes crear el perfil de tu mascota antes de interactuar.",
      );
      return;
    }

    const token = sessionStorage.getItem("token");

    try {
      if (toPetId === "1") {
        setMessage(`Le diste ${action} a Luna 🐾`);
        setPets(pets.filter((p) => p._id !== toPetId));
        setTimeout(() => setMessage(""), 2000);
        return;
      }

      const res = await axios.post(
        "http://localhost:3005/api/matches/swipe",
        {
          fromPetId: myPetId,
          toPetId: toPetId,
          action: action,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      //animacion para el match
      if (res.data.isMatch) {
        setMatchPopup(res.data.matchData);
      } else {
        setMessage(`Le diste ${action} a la mascota 🐾`);
      }

      setPets(pets.filter((p) => p._id !== toPetId));
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      if (error.response?.data?.error === "Ya deslizaste sobre esta mascota") {
        setPets(pets.filter((p) => p._id !== toPetId));
      } else {
        console.error(error);
      }
    }
  };

  const filteredPets = useMemo(() => {
      return pets.filter((pet) => {
        const matchesSearch = pet.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesSpecies = speciesFilter === "all" || pet.species === speciesFilter;
        return matchesSearch && matchesSpecies;
      });
    }, [pets, searchTerm, speciesFilter]);
  
    const speciesOptions = useMemo(() => {
      const options = new Set(pets.map((pet) => pet.species).filter(Boolean));
      return ["all", ...Array.from(options)];
    }, [pets]);

  if (loading)
    return (
      <div className="text-center mt-20 text-brand-purple font-bold text-xl animate-pulse">
        Buscando amiguitos... 🐾
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 relative">
      {matchPopup && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-white p-10 rounded-3xl text-center shadow-2xl flex flex-col items-center">
            <h2 className="text-5xl mb-4">💖</h2>
            <h1 className="text-4xl font-bold text-brand-purple mb-2">
              ¡Es un Match!
            </h1>
            <p className="text-gray-600 mb-8">
              Tú y otra mascota se gustan. ¡Es hora de chatear!
            </p>
            <button
              onClick={() => setMatchPopup(null)}
              className="bg-gradient-brand text-white px-8 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition-all"
            >
              Seguir explorando
            </button>
          </div>
        </motion.div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Mascotas destacadas
        </h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre"
            className="px-4 py-2 border border-gray-200 rounded-full w-full sm:w-64 shadow-sm outline-none focus:border-brand-purple transition-all"
          />
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-full shadow-sm outline-none bg-white focus:border-brand-purple transition-all cursor-pointer"
          >
            {speciesOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "Todas" : option}
              </option>
            ))}
          </select>
        </div>
        <div className="h-6 mt-4">
          {message && (
            <p className="text-brand-pink font-bold animate-bounce">
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        <AnimatePresence>
          {filteredPets.length === 0 ? (
            <p className="text-gray-500 col-span-1 sm:col-span-2 lg:col-span-3 text-center">
              No hay más mascotas cerca por ahora. ¡Vuelve pronto!
            </p>
          ) : (
            filteredPets.map((pet) => (
              <PetCard
                key={pet._id}
                pet={pet}
                onSwipe={(action) => handleSwipe(action, pet._id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Explorar;
