import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faMagnifyingGlass, faPaw, faShieldHalved, faUsers } from "@fortawesome/free-solid-svg-icons";
import { adminApi, getApiError } from "../services/api";

const initialPetFilters = {
  search: "",
  type: "",
  status: "",
};

const initialUserFilters = {
  search: "",
  role: "",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, pets: 0, matches: 0, status: "CARGANDO" });
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [petFilters, setPetFilters] = useState(initialPetFilters);
  const [userFilters, setUserFilters] = useState(initialUserFilters);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPets, setLoadingPets] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const publicImages = useMemo(() => pets.map((pet) => pet.photo).filter(Boolean), [pets]);

  const authHeaders = () => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    }
  };

  const loadStats = async () => {
    const res = await adminApi.stats();
    setStats(res.data);
  };

  const loadMatches = async () => {
    const res = await adminApi.matches();
    setRecentMatches(res.data);
  };

  const loadPets = async (filters = petFilters) => {
    setLoadingPets(true);
    try {
      const res = await adminApi.pets({ ...filters, page: 1, limit: 50 });
      setPets(res.data);
    } catch (err) {
      setError(getApiError(err, "Error cargando mascotas."));
    } finally {
      setLoadingPets(false);
    }
  };

  const loadUsers = async (filters = userFilters) => {
    setLoadingUsers(true);
    try {
      const res = await adminApi.users({ ...filters, page: 1, limit: 50 });
      setUsers(res.data.data || []);
    } catch (err) {
      setError(getApiError(err, "Error cargando usuarios."));
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    authHeaders();

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        await Promise.all([loadStats(), loadMatches(), loadPets(initialPetFilters), loadUsers(initialUserFilters)]);
      } catch (err) {
        setError(getApiError(err, "No se pudo cargar el dashboard."));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleScroll = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("pettin_user");
    navigate("/login");
  };

  const handlePetFilterChange = (event) => {
    const { name, value } = event.target;
    setPetFilters((current) => ({ ...current, [name]: value }));
  };

  const handleUserFilterChange = (event) => {
    const { name, value } = event.target;
    setUserFilters((current) => ({ ...current, [name]: value }));
  };

  const handleShowUser = async (id) => {
    setError("");
    setNotice("");

    try {
      const res = await adminApi.userById(id);
      setSelectedUser(res.data);
    } catch (err) {
      setError(getApiError(err, "No se pudo obtener el usuario."));
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      setError("Nombre y correo son obligatorios.");
      return;
    }

    try {
      const res = await adminApi.updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });

      setUsers((current) => current.map((user) => (user._id === res.data._id ? { ...user, ...res.data } : user)));
      setEditingUser(null);
      setNotice("Usuario actualizado correctamente.");
    } catch (err) {
      setError(getApiError(err, "No se pudo actualizar el usuario."));
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm("Quieres eliminar este usuario y sus mascotas?");
    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await adminApi.deleteUser(id);
      setUsers((current) => current.filter((user) => user._id !== id));
      await Promise.all([loadStats(), loadPets()]);
      setNotice("Usuario eliminado correctamente.");
    } catch (err) {
      setError(getApiError(err, "No se pudo eliminar el usuario."));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-white bg-slate-600 rounded-3xl">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-600 p-3 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3),_inset_0px_0px_15px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto rounded-2xl p-4 md:p-8">
        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white flex flex-wrap items-baseline gap-x-3 leading-none">
            Dashboard <span className="text-2xl md:text-3xl text-slate-300 italic">Administrador</span>
          </h1>
          <p className="text-slate-300 mt-3 text-lg md:text-xl">Gestiona usuarios, mascotas y actividad real del backend.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 backdrop-blur-md bg-slate-500/80 rounded-3xl shadow-xl p-6 h-fit sticky top-10 z-30">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-bold text-yellow-500">Menu</h2>
              <button className="lg:hidden text-2xl text-white" onClick={() => setIsOpen((current) => !current)}>
                {isOpen ? "x" : "☰"}
              </button>
            </div>
            <nav className={`${isOpen ? "flex" : "hidden"} lg:flex flex-col gap-3`}>
              <a href="#stats" onClick={(event) => handleScroll(event, "stats")} className="text-white hover:text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-2xl font-medium transition-all">Resumen</a>
              <a href="#users" onClick={(event) => handleScroll(event, "users")} className="text-white hover:text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-2xl font-medium transition-all">Usuarios</a>
              <a href="#pets" onClick={(event) => handleScroll(event, "pets")} className="text-white hover:text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-2xl font-medium transition-all">Mascotas</a>
              <a href="#matches" onClick={(event) => handleScroll(event, "matches")} className="text-white hover:text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-2xl font-medium transition-all">Matches</a>
              <a href="#gallery" onClick={(event) => handleScroll(event, "gallery")} className="text-white hover:text-purple-700 hover:bg-purple-50 px-4 py-2.5 rounded-2xl font-medium transition-all">Galeria</a>
              <button onClick={handleLogout} className="text-left text-white hover:bg-red-400 px-4 py-2.5 rounded-2xl font-bold transition-all">
                Cerrar Sesion
              </button>
            </nav>
          </aside>

          <div className="lg:col-span-9 space-y-10">
            {(notice || error) && (
              <div className={`rounded-2xl p-4 font-semibold ${error ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                {error || notice}
              </div>
            )}

            <section id="stats" className="grid grid-cols-2 xl:grid-cols-4 gap-2">
              {[
                ["Mascotas registradas", stats.pets, faPaw, "text-purple-600", "bg-purple-100"],
                ["Usuarios activos", stats.users, faUsers, "text-pink-600", "bg-pink-100"],
                ["Matches guardados", stats.matches, faChartLine, "text-indigo-600", "bg-indigo-100"],
                ["Estado del sistema", stats.status, faShieldHalved, "text-green-600", "bg-green-100"],
              ].map(([label, value, icon, color, bg]) => (
                <div key={label} className="bg-white rounded-3xl shadow-xl p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{label}</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 break-words">{value}</h3>
                    </div>
                    <div className={`${bg} p-3 rounded-2xl ${color} flex items-center justify-center`}>
                      <FontAwesomeIcon icon={icon} className="w-7 h-7" />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section id="users" className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">CRUD de usuarios</h2>
                  <p className="text-gray-600">El backend permite listar, ver detalle, editar y eliminar desde admin.</p>
                  <p className="text-sm text-amber-600 mt-1">
                    No existe endpoint admin para crear usuarios; la creacion disponible es el registro publico con OTP.
                  </p>
                </div>
                <Link to="/registro" className="bg-gradient-brand px-5 py-2.5 rounded-full font-bold text-center">
                  Crear por registro
                </Link>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  loadUsers(userFilters);
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
              >
                <div className="relative md:col-span-2">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="search" value={userFilters.search} onChange={handleUserFilterChange} placeholder="Buscar por nombre o correo" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <select name="role" value={userFilters.role} onChange={handleUserFilterChange} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500">
                  <option value="">Todos los roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="bg-slate-700 text-white rounded-xl font-bold px-4 py-2">
                  {loadingUsers ? "Buscando..." : "Filtrar"}
                </button>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-500 text-sm border-b">
                      <th className="py-3">Nombre</th>
                      <th className="py-3">Correo</th>
                      <th className="py-3">Rol</th>
                      <th className="py-3">Auth</th>
                      <th className="py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">No hay usuarios para mostrar.</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user._id} className="border-b last:border-b-0 text-gray-700">
                          <td className="py-3 font-semibold">{user.name}</td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">{user.role}</td>
                          <td className="py-3">{user.authProvider}</td>
                          <td className="py-3">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleShowUser(user._id)} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">Ver</button>
                              <button onClick={() => handleEditUser(user)} className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">Editar</button>
                              <button onClick={() => handleDeleteUser(user._id)} className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold">Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {selectedUser && (
                <div className="mt-6 bg-slate-50 rounded-2xl p-5">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900">Detalle de usuario</h3>
                      <p className="text-gray-700">{selectedUser.name} - {selectedUser.email}</p>
                      <p className="text-sm text-gray-500">Rol: {selectedUser.role} | Auth: {selectedUser.authProvider}</p>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-gray-500 font-bold">Cerrar</button>
                  </div>
                </div>
              )}

              {editingUser && (
                <form onSubmit={handleUpdateUser} className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 bg-slate-50 rounded-2xl p-5">
                  <input value={editingUser.name} onChange={(event) => setEditingUser((current) => ({ ...current, name: event.target.value }))} className="px-4 py-2 border border-gray-200 rounded-xl" placeholder="Nombre" />
                  <input type="email" value={editingUser.email} onChange={(event) => setEditingUser((current) => ({ ...current, email: event.target.value }))} className="px-4 py-2 border border-gray-200 rounded-xl" placeholder="Correo" />
                  <select value={editingUser.role} onChange={(event) => setEditingUser((current) => ({ ...current, role: event.target.value }))} className="px-4 py-2 border border-gray-200 rounded-xl">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-gradient-brand rounded-xl font-bold">Guardar</button>
                    <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-white border border-gray-200 rounded-xl font-bold text-gray-700">Cancelar</button>
                  </div>
                </form>
              )}
            </section>

            <section id="pets" className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Listado de mascotas</h2>
                  <p className="text-gray-600">Filtros conectados a `/api/admin/pets`.</p>
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  loadPets(petFilters);
                }}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
              >
                <div className="relative md:col-span-2">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="search" value={petFilters.search} onChange={handlePetFilterChange} placeholder="Buscar por nombre o raza" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                <select name="type" value={petFilters.type} onChange={handlePetFilterChange} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500">
                  <option value="">Todos los tipos</option>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                  <option value="otro">Otro</option>
                </select>
                <div className="flex gap-2">
                  <select name="status" value={petFilters.status} onChange={handlePetFilterChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500">
                    <option value="">Estado</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                  <button type="submit" className="bg-slate-700 text-white rounded-xl font-bold px-4 py-2">
                    {loadingPets ? "..." : "Filtrar"}
                  </button>
                </div>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-500 text-sm border-b">
                      <th className="py-3">Nombre</th>
                      <th className="py-3">Tipo</th>
                      <th className="py-3">Raza</th>
                      <th className="py-3">Edad</th>
                      <th className="py-3">Sexo</th>
                      <th className="py-3">Estado</th>
                      <th className="py-3">Dueno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-gray-500">No hay mascotas para mostrar.</td>
                      </tr>
                    ) : (
                      pets.map((pet) => (
                        <tr key={pet.id} className="border-b last:border-b-0 text-gray-700">
                          <td className="py-3 font-semibold">{pet.name}</td>
                          <td className="py-3">{pet.species}</td>
                          <td className="py-3">{pet.breed}</td>
                          <td className="py-3">{pet.age}</td>
                          <td className="py-3">{pet.sex}</td>
                          <td className="py-3">{pet.status}</td>
                          <td className="py-3">{pet.owner}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="matches" className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Matches recientes</h2>
              <div className="space-y-4">
                {recentMatches.length === 0 ? (
                  <p className="text-gray-500">No hay matches registrados.</p>
                ) : (
                  recentMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl">
                      <div>
                        <p className="font-semibold text-gray-800">{match.petName}</p>
                        <p className="text-sm text-gray-500">Accion: {match.action}</p>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(match.timestamp).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section id="gallery" className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Galeria de Mascotas</h2>
                <p className="text-gray-600">Fotos existentes tomadas de las mascotas listadas por el backend.</p>
              </div>
              {publicImages.length === 0 ? (
                <p className="text-gray-500">Todavia no hay fotos de mascotas subidas.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {publicImages.map((image) => (
                    <div key={image} className="rounded-2xl overflow-hidden shadow-md h-40">
                      <img src={image} alt="Mascota" className="w-full h-full object-cover" />
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
};

export default Dashboard;
