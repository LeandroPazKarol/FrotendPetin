import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PetCard from "../components/PetCard";
import ProfilePet from "../components/ProfilePet";
import { getApiError, matchesApi, petsApi } from "../services/api";

const initialFilters = {
  search: "",
  type: "",
  lookingFor: "",
  minAge: "",
  maxAge: "",
};

const Explorar = () => {
  const [pets, setPets] = useState([]);
  const [myPetId, setMyPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [matchPopup, setMatchPopup] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedPet, setSelectedPet] = useState(null);

  const loadPets = async (currentFilters = filters, isFiltering = false) => {
    if (isFiltering) {
      setApplyingFilters(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [myPetsRes, feedRes] = await Promise.all([
        petsApi.listMine(),
        petsApi.listFeed({
          ...currentFilters,
          page: 1,
          limit: 30,
          sort: "-createdAt",
        }),
      ]);

      setMyPetId(myPetsRes.data[0]?._id || null);
      setPets(feedRes.data);
    } catch (err) {
      setError(getApiError(err, "No se pudieron cargar las mascotas."));
      setPets([]);
    } finally {
      setLoading(false);
      setApplyingFilters(false);
    }
  };

  useEffect(() => {
    loadPets(initialFilters);
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    loadPets(filters, true);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    loadPets(initialFilters, true);
  };

  const handleSwipe = async (action, toPetId) => {
    if (!myPetId) {
      setError("Primero debes crear el perfil de tu mascota antes de interactuar.");
      return;
    }

    try {
      const res = await matchesApi.swipe({
        fromPetId: myPetId,
        toPetId,
        action,
      });

      if (res.data.isMatch) {
        setMatchPopup(res.data.matchData);
      } else {
        setMessage(`Le diste ${action} a la mascota`);
      }

      setPets((currentPets) => currentPets.filter((pet) => pet._id !== toPetId));
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      const apiMessage = getApiError(err, "No se pudo procesar tu accion.");
      if (apiMessage.includes("Ya deslizaste")) {
        setPets((currentPets) => currentPets.filter((pet) => pet._id !== toPetId));
      } else {
        setError(apiMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-brand-purple font-bold text-xl animate-pulse">
        Buscando mascotas...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 relative">
      {selectedPet && (
        <ProfilePet
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onSwipe={(action) => {
            handleSwipe(action, selectedPet._id);
            setSelectedPet(null);
          }}
        />
      )}

      {matchPopup && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-white p-10 rounded-3xl text-center shadow-2xl flex flex-col items-center">
            <h2 className="text-5xl mb-4">Match</h2>
            <h1 className="text-4xl font-bold text-brand-purple mb-2">
              Es un Match
            </h1>
            <p className="text-gray-600 mb-8">
              Tu mascota y otra mascota se gustan. Ya pueden chatear.
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
        <h1 className="text-4xl font-bold text-gray-800">Mascotas Destacadas</h1>

        <form
          onSubmit={handleApplyFilters}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-6 text-left"
        >
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Buscar por nombre"
            className="lg:col-span-2 px-4 py-2 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-purple transition-all"
          />

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm outline-none bg-white focus:border-brand-purple transition-all"
          >
            <option value="">Tipo</option>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="otro">Otro</option>
          </select>

          <select
            name="lookingFor"
            value={filters.lookingFor}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm outline-none bg-white focus:border-brand-purple transition-all"
          >
            <option value="">Busca</option>
            <option value="amistad">Amistad</option>
            <option value="pareja">Pareja</option>
            <option value="paseos">Paseos</option>
          </select>

          <input
            type="number"
            min="0"
            name="minAge"
            value={filters.minAge}
            onChange={handleFilterChange}
            placeholder="Edad min."
            className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-purple transition-all"
          />

          <input
            type="number"
            min="0"
            name="maxAge"
            value={filters.maxAge}
            onChange={handleFilterChange}
            placeholder="Edad max."
            className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-purple transition-all"
          />

          <div className="sm:col-span-2 lg:col-span-6 flex flex-wrap justify-center gap-3">
            <button
              type="submit"
              disabled={applyingFilters}
              className="bg-gradient-brand px-6 py-2 rounded-full font-bold disabled:opacity-60"
            >
              {applyingFilters ? "Filtrando..." : "Aplicar filtros"}
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold hover:border-brand-purple"
            >
              Limpiar
            </button>
          </div>
        </form>

        <div className="min-h-6 mt-4">
          {message && <p className="text-brand-pink font-bold">{message}</p>}
          {error && <p className="text-red-600 font-semibold">{error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        <AnimatePresence>
          {pets.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-soft p-8 text-gray-500 text-xl col-span-1 sm:col-span-2 lg:col-span-3 text-center w-full">
              No hay mascotas que coincidan con tu busqueda.
            </div>
          ) : (
            pets.map((pet) => (
              <PetCard
                key={pet._id}
                pet={pet}
                onSwipe={(action) => handleSwipe(action, pet._id)}
                onViewProfile={(petToView) => setSelectedPet(petToView)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Explorar;
