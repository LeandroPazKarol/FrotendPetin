import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import { API_URL } from '../services/api';

const Registro = () => {
  
  // guarda los datos que el usuario va escribiendo en tiempo real
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para OTP
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // nuevo usuario en la bd
      const response = await axios.post(`${API_URL}/api/auth/register`, formData);
      
      if (response.data.requireOtp) {
        setUserEmail(response.data.email);
        setShowOtpModal(true);
        setError('');
        return;
      }

      // guardamos en sessionStorage para mantener la sesión (código antiguo)
      sessionStorage.setItem('token', response.data.token);
      window.location.href = '/perfil';
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: userEmail,
        otpCode: otpCode
      });

      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('pettin_user', JSON.stringify(res.data)); 

      window.location.href = '/perfil'; // El nuevo usuario debe ir a perfil a crear su mascota
    } catch (err) {
      setError(err.response?.data?.error || 'Código incorrecto o expirado');
    }
  };

  const toggleVisibility = (field) => {
    if(field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  }

  return (
    <div className="flex min-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-xl max-w-5xl mx-auto my-4 md:my-8">
      {/* Columna Izquierda: Imagen Decorativa */}
      <div className="hidden md:flex w-1/2 relative bg-gray-200">
        <img 
          src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Perro feliz" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-8 left-8 right-8 text-lg bg-white/20 backdrop-blur-md p-4 rounded-2xl text-white font-medium border border-white/30">
          "Encontrar amigos para tu mascota nunca fue tan fácil"
        </div>
      </div>

      <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
        <div className="flex justify-center md:justify-start items-center gap-2 mb-4 mt-5">
          <div className="w-10 h-10 rounded bg-gradient-brand flex items-center justify-center text-white font-bold">
            <span className="[text-shadow:0_0_4px_#fff] text-2xl">🐾</span>
          </div>
          <span className="text-2xl font-bold text-brand-purple">Pettin</span>
        </div>

        <h1 className="text-4xl hover:3xl font-bold text-gray-800 mb-2 text-center md:text-left">Crear cuenta</h1>
        <p className="text-gray-500 text-md hover:text-sm mb-4 text-center md:text-left">Únete a nuestra comunidad y encuentra amigos para tu mascota</p>

     
        <div className="flex flex-col gap-3 mb-4">
          <Button variant="outline" icon={faGoogle} text="Registrarse con Google" />
          <Button variant="black" icon={faApple} text="Registrarse con Apple" />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs text-gray-400">o regístrate con correo</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <InputBox name="name" placeholder="Nombre completo" onChange={handleChange} />
          <InputBox name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} />
          <div className="relative w-full">
            <InputBox
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña (mín. 6 caracteres)"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => toggleVisibility('password')}
              className="absolute right-5 top-1/2 -translate-y-4 flex items-center"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5"/>
            </button>
          </div>
          <div className="relative w-full">
            <InputBox
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => toggleVisibility('confirmPassword')}
              className="absolute right-5 top-1/2 -translate-y-4 flex items-center"
              aria-label={showConfirmPassword ? "Ocultar confirmar contraseña" : "Mostrar confirmar contraseña"}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-5 w-5"/>
            </button>
          </div>

          <div className="mt-1">
            <Button type="submit" variant="primary" text="Crear cuenta" fullWidth />
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta? <Link to="/login" className="text-brand-purple font-semibold">Inicia sesión</Link>
        </p>
      </div>

      {/* MODAL DE VERIFICACIÓN OTP */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifica tu correo</h2>
            <p className="text-gray-500 mb-6">Hemos enviado un código de 6 dígitos a <b>{userEmail}</b> para confirmar tu registro.</p>
            
            {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Ingresa el código (ej. 123456)" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.5em] py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-brand-purple"
                maxLength={6}
                required
              />
              <Button type="submit" variant="primary" text="Verificar y Crear Cuenta" fullWidth />
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Registro;
