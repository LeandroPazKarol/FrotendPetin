import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faUsers, faChartLine, faShieldHalved, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'; 

const Dashboard = () => {
    const [pets, setPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(true);
    const publicImages = useMemo(() => {
        return pets.map(pet => pet.photo).filter(photo => photo != null);
    }, [pets]);
    const [searchTerm, setSearchTerm] = useState("");
    const [speciesFilter, setSpeciesFilter] = useState("all");
    const [isOpen, setIsOpen] = useState(false);

 
    const [stats, setStats] = useState({ users: 0, pets: 0, matches: 0, status: "CARGANDO" });
    const [recentMatches, setRecentMatches] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        //Cargar las mascotas y usuarios 
        const loadRealPets = async () => {
            try {
                setLoadingPets(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/pets`, { headers });
                setPets(res.data);
            } catch (error) {
                console.error("Error cargando mascotas:", error);
            } finally {
                setLoadingPets(false);
            }
        };

        // carga de datos
        const loadStats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { headers });
                setStats(res.data);
            } catch (error) {
                console.error("Error cargando estadísticas:", error);
            }
        };

        // carga de matches
        const loadMatches = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/matches`, { headers });
                setRecentMatches(res.data);
            } catch (error) {
                console.error("Error cargando matches:", error);
            }
        };

        loadRealPets();
        loadStats();
        loadMatches();
    }, []);





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

    const handleScroll = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
            })
        }
    }

    return (
        <div className="min-h-screen bg-slate-600 from-slate-50 via-white to-purple-50 p-3 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3),_inset_0px_0px_15px_rgba(0,0,0,0.8)]">
            <div className="max-w-7xl mx-auto rounded-2xl p-8">
                <div className="mb-10">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white flex flex-wrap items-baseline gap-x-3 leading-none">
                        Dashboard <span className="text-3xl text-slate-300 font-medium">Administrador</span>
                    </h1>
                    <p className="text-slate-300 mt-3 text-xl md:text-xl">Gestiona usuarios, mascotas y actividad en tiempo real.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <aside className="lg:col-span-3 backdrop-blur-md bg-slate-500/70 rounded-3xl shadow-xl p-6 h-fit sticky top-10 relative z-30">
                        <div className="flex justify-between items-center mb-1 md:mb-3">
                            <h2 className="text-3xl font-bold text-yellow-500">Menu</h2>
                            <button
                                className="lg:hidden text-2xl text-white focus:outline-none"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? '✖' : '☰'}
                            </button>
                        </div>
                        <nav className="hidden lg:block space-y-3">
                            <a href="#stats" onClick={(e) => handleScroll(e, 'stats')} className="block text-white hover:text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300">Resumen</a>
                            <a href="#pets" onClick={(e) => handleScroll(e, 'pets')} className="block text-white hover:text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300">Mascotas</a>
                            <a href="#matches" onClick={(e) => handleScroll(e, 'matches')} className="block text-white hover:text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300">Matches</a>
                            <a href="#public" onClick={(e) => handleScroll(e, 'public')} className="block text-white hover:text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300">API Publica</a>
                        </nav>
                        {isOpen && (
                            <nav className="lg:hidden flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 text-gray-600 font-bold">
                                <a href="#stats" onClick={(e) => handleScroll(e, 'stats')} className="block text-white hover:text-purple-700 hover:bg-purple-200 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300">Resumen</a>
                                <a href="#pets" onClick={(e) => handleScroll(e, 'pets')} className="block text-white hover:text-purple-700 hover:bg-purple-200 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300">Mascotas</a>
                                <a href="#matches" onClick={(e) => handleScroll(e, 'matches')} className="block text-white hover:text-purple-700 hover:bg-purple-200 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300">Matches</a>
                                <a href="#public" onClick={(e) => handleScroll(e, 'public')} className="block text-white hover:text-purple-700 hover:bg-purple-200 px-4 py-2.5 rounded-2xl font-medium transition-all duration-300">API Publica</a>
                            </nav>
                        )}
                    </aside>

                    <div className="lg:col-span-9 space-y-10">
                        <section id="stats" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            <div className="bg-white rounded-3xl shadow-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Mascotas registradas</p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pets}</h3>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-2xl text-purple-600 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faPaw} className="w-7 h-7" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Usuarios activos</p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</h3>
                                    </div>
                                    <div className="bg-pink-100 p-3 rounded-2xl text-pink-600 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUsers} className="w-7 h-7" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Matches guardados</p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.matches}</h3>
                                    </div>
                                    <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faChartLine} className="w-7 h-7" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Estado del sistema</p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.status}</h3>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-2xl text-green-600 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faShieldHalved} className="w-7 h-7" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="pets" className="bg-white rounded-3xl shadow-xl p-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Listado de mascotas</h2>
                                    <p className="text-gray-600">Administra registros y aplica filtros.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(event) => setSearchTerm(event.target.value)}
                                            placeholder="Buscar por nombre"
                                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <select
                                        value={speciesFilter}
                                        onChange={(event) => setSpeciesFilter(event.target.value)}
                                        className="px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-purple-500"
                                    >
                                        {speciesOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option === "all" ? "Todas" : option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {loadingPets ? (
                                <div className="py-10 text-center text-gray-500">Cargando mascotas...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-gray-500 text-sm border-b">
                                                <th className="py-3">Nombre</th>
                                                <th className="py-3">Especie</th>
                                                <th className="py-3">Raza</th>
                                                <th className="py-3">Edad</th>
                                                <th className="py-3">Dueño</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPets.map((pet) => (
                                                <tr key={pet.id} className="border-b last:border-b-0 text-gray-700">
                                                    <td className="py-3 font-semibold">{pet.name}</td>
                                                    <td className="py-3">{pet.species}</td>
                                                    <td className="py-3">{pet.breed}</td>
                                                    <td className="py-3">{pet.age}</td>
                                                    <td className="py-3">{pet.owner}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        <section id="matches" className="bg-white rounded-3xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Matches recientes</h2>
                            <div className="space-y-4">
                                {recentMatches.length === 0 ? (
                                    <p className="text-gray-500">No hay matches registrados.</p>
                                ) : (
                                    recentMatches.map((match) => (
                                        <div key={match.id} className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl">
                                            <div>
                                                <p className="font-semibold text-gray-800">{match.petName}</p>
                                                <p className="text-sm text-gray-500">Acción: {match.action}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(match.timestamp).toLocaleString()}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section id="public" className="bg-white rounded-3xl shadow-xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Galería de Mascotas</h2>
                                    <p className="text-gray-600">Fotos subidas recientemente por nuestra comunidad.</p>
                                </div>
                            </div>
                            {publicImages.length === 0 ? (
                                <p className="text-gray-500">Todavía no hay fotos de mascotas subidas.</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {publicImages.map((image, idx) => (
                                        <div key={idx} className="rounded-2xl overflow-hidden shadow-md h-40">
                                            <img src={image} alt={`Mascota ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;