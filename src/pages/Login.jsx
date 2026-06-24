import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import InputBox from '../components/InputBox';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState("");

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

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="flex h-[80vh] bg-white rounded-3xl overflow-hidden shadow-xl max-w-5xl mx-auto">

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
        <div className="flex justify-center md:justify-start items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded bg-gradient-brand flex items-center justify-center text-white font-bold">
            <span className="[text-shadow:0_0_4px_#fff] text-2xl">🐾</span>
          </div>
          <span className="text-2xl font-bold text-brand-purple">Pettin</span>
        </div>

        <h1 className="text-5xl md:text-4xl font-bold text-gray-800 mb-2 text-center md:text-left">Bienvenido</h1>
        <p className="text-gray-500 text-lg md:text-xl mb-8 text-center md:text-left">Inicia sesión para continuar explorando</p>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <button className="w-full border-2 border-gray-300 hover:border-purple-400 py-3 rounded-full mb-3 font-medium hover:bg-purple-50 transition duration-300">
          <FontAwesomeIcon
            icon={faGoogle}
            alt="Google"
            className="w-4 h-4 inline mr-2 filter brightness-0"
          />
          Continuar con Google
        </button>

        <button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full mb-6 font-medium transition duration-300">
          <FontAwesomeIcon
            icon={faApple}
            alt="Apple"
            className="w-5 h-5 inline mr-2 filter brightness-0 invert"
          />
          Continuar con Apple
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs text-gray-400">o ingresa tú correo</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputBox name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} />
          <div className="relative w-full">
            <InputBox
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-5 top-1/2 -translate-y-3/4 flex items-center"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
            </button>
          </div>

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
