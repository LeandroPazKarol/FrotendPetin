import { motion } from 'framer-motion';

const ProfilePet = ({ pet, onClose, onSwipe }) => {
    const imageUrl = pet?.photos?.length > 0 ? pet.photos[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[390px] h-[530px] rounded-3xl overflow-hidden shadow-soft bg-white mx-auto flex flex-col"
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-4 z-20 w-10 h-10 bg-black/50 text-white text-2xl rounded-full flex items-center justify-center hover:bg-red-500"
                >
                    x
                </button>

                <div className="h-72 w-full relative">
                    <img
                        src={imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"/>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-3xl font-bold">{pet.name}, {pet.age}</h2>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-gray-600">
                        {pet.description || "Sin descripción disponible."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                            {pet.type || "Mascota"}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{pet.breed || "Raza no especificada"}</span>
                    </div>
                    <div className="flex justify-center gap-4 pt-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => onSwipe('dislike')}
                            className="w-14 h-14 rounded-full border-2 border-red-200 flex justify-center items-center text-red-400 text-2xl hover:bg-red-50"
                        >
                            ❌
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                            onClick={() => onSwipe('like')}
                            className="w-14 h-14 rounded-full bg-gradient-brand flex justify-center items-center text-white text-3xl hover:opacity-90 shadow-md"
                        >
                            ❤️
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfilePet;