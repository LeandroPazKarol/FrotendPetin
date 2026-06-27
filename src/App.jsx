import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Explorar from './pages/Explorar';
import Perfil from './pages/Perfil';
import Matches from './pages/Matches';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  // Verificamos si el usuario ya inició sesión para renderizar el Navbar
  const isAuthenticated = !!sessionStorage.getItem('token');
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#FAF8FC]">
      {isAuthenticated && !isAdminRoute && <Navbar />}

      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Ruta Raíz: Redirige automáticamente al Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas Públicas */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas Encadenadas (Anidadas) Privadas Generales SOLO PARA USUARIOS */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>

          {/* Rutas Encadenadas Privadas de Administrador */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>
          
          <Route 
            path="*" 
            element={<NotFound />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
