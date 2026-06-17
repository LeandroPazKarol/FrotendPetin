import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Explorar from './pages/Explorar';
import Perfil from './pages/Perfil';
import Matches from './pages/Matches';

function App() {
  // Verificamos si el usuario ya inició sesión revisando si existe un token en su pestaña actual (sessionStorage)

  const isAuthenticated = !!sessionStorage.getItem('token');

  return (
    <div className="min-h-screen bg-[#FAF8FC]">
      {isAuthenticated && <Navbar />}

      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas Privadas*/}
          <Route 
            path="/explorar" 
            element={isAuthenticated ? <Explorar /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/matches" 
            element={isAuthenticated ? <Matches /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/perfil" 
            element={isAuthenticated ? <Perfil /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/explorar" : "/login"} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
