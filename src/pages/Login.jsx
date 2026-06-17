import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InputBox from '../components/InputBox';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para el ingreso
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // enviamos el correo y contraseña a nuestra API
      const response = await axios.post('http://localhost:3005/api/auth/login', formData);
      
      // guardamos la llave de acceso (Token)
      sessionStorage.setItem('token', response.data.token);
 
      window.location.href = '/explorar'; 
    } catch (err) {
      setError(err.response?.data?.error || 'Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="flex h-[80vh] bg-white rounded-3xl overflow-hidden shadow-soft max-w-5xl mx-auto">
  
      <div className="hidden md:flex w-1/2 relative bg-gray-200">
        <img 
          src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Perro feliz" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-8 left-8 right-8 bg-white/20 backdrop-blur-md p-4 rounded-2xl text-white font-medium border border-white/30">
          "Bienvenido de vuelta. Tu mascota te espera."
        </div>
      </div>


      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-6">
           <div className="w-8 h-8 rounded bg-gradient-brand flex items-center justify-center text-white font-bold">🐾</div>
           <span className="text-xl font-bold text-brand-purple">Pettin</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Iniciar sesión</h1>
        <p className="text-gray-500 text-sm mb-8">Ingresa tus datos para continuar</p>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputBox name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} />
          <InputBox name="password" type="password" placeholder="Contraseña" onChange={handleChange} />

          <div className="mt-4">
            <Button type="submit" variant="primary" text="Ingresar" fullWidth />
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta? <Link to="/registro" className="text-brand-purple font-semibold">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
