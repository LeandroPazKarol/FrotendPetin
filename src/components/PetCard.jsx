import { motion } from 'framer-motion';

const PetCard = ({ pet, onSwipe, onViewProfile }) => {
  const imageUrl = pet?.photos?.length > 0 ? pet.photos[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-[320px] h-[500px] rounded-3xl overflow-hidden shadow-soft bg-white mx-auto flex flex-col"
    >
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1 z-10 shadow-sm">
        📍 2 km de distancia
      </div>
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1 z-10">
        ⭐ 95%
      </div>

      <div className="h-2/3 w-full relative">
        <img 
          src={imageUrl} 
          alt={pet.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-3xl font-bold">{pet.name}, {pet.age}</h2>
          <div className="flex gap-2 mt-2">
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs backdrop-blur-md">Juguetón</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs backdrop-blur-md">Amigable</span>
          </div>
        </div>
      </div>

      <div className="h-1/3 p-4 flex flex-col justify-between">
        <p className="text-gray-500 text-sm line-clamp-3">
          {pet.description || "Esta mascota es muy amigable y busca compañía para pasear y jugar en el parque."}
        </p>

        <div className="flex justify-center items-center gap-4 mt-2">
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onSwipe('dislike')}
            className="w-12 h-12 rounded-full border border-gray-200 flex justify-center items-center text-red-400 text-xl hover:bg-red-50 transition-colors shadow-sm"
          >
            ❌
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onViewProfile(pet)}
            className="w-12 h-12 rounded-full border border-gray-200 flex justify-center items-center text-orange-400 text-xl hover:bg-orange-50 transition-colors shadow-sm"
          >
            🐾
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={() => onSwipe('like')}
            className="w-14 h-14 rounded-full bg-gradient-brand flex justify-center items-center text-white text-2xl hover:opacity-90 shadow-md"
          >
            ❤️
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PetCard;
