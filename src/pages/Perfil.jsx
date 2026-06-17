import { useState, useEffect } from 'react';
import axios from 'axios';
import InputBox from '../components/InputBox';
import Button from '../components/Button';

const Perfil = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [petData, setPetData] = useState({ name: '', type: 'perro', breed: '', age: '' });
  const [imageFile, setImageFile] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [message, setMessage] = useState('');

  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    
    // Obtenemos el nombre y correo del DUEÑO desde la base de datos
    axios.get('http://localhost:3005/api/auth/me', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache' 
      }
    }).then(res => {
      setUserData({ name: res.data.name, email: res.data.email });
    }).catch(err => console.log(err));

    //Averiguamos si este dueño ya tiene una MASCOTA registrada
    axios.get('http://localhost:3005/api/pets/my-pets', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    }).then(res => {
      if (res.data.length > 0) {
        const myPet = res.data[0];
        setPetData({ name: myPet.name, type: myPet.type, breed: myPet.breed, age: myPet.age });
        if (myPet.photos?.length > 0) {
          setExistingPhoto(myPet.photos[0]);
        }
      } else {
    
        setPetData({ name: '', type: 'perro', breed: '', age: '' });
        setExistingPhoto(null);
      }
    }).catch(err => console.log(err));
  }, []);

  const handlePetChange = (e) => {
    setPetData({ ...petData, [e.target.name]: e.target.value });
  };

  // Guardar o actualizar datos de la mascota
  const handleSavePet = async () => {
    const token = sessionStorage.getItem('token');

    const formData = new FormData();
    formData.append('name', petData.name);
    formData.append('type', petData.type);
    formData.append('breed', petData.breed);
    formData.append('age', petData.age);
    if (imageFile) {
      formData.append('photos', imageFile);
    }

    try {
      // se encargar de subir la foto a Cloudinary
      await axios.post('http://localhost:3005/api/pets', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      setMessage('¡Perfil de mascota guardado con éxito!');
    } catch (error) {
      console.error(error); 
      setMessage('Hubo un error al guardar.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Edita la información de tu perfil y de tu mascota</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Tarjeta Izquierda (Degradado y Foto) */}
        <div className="w-full md:w-1/3 bg-white rounded-3xl p-6 shadow-soft flex flex-col items-center">
          <div className="w-full h-48 bg-gradient-brand rounded-2xl mb-6 relative flex justify-center items-center overflow-hidden shadow-inner">
             {existingPhoto ? (
               <img src={existingPhoto} alt="Mascota" className="w-full h-full object-cover" />
             ) : (
               <span className="text-5xl">🐾</span>
             )}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{userData.name || 'Cargando...'}</h2>
          <p className="text-gray-500 text-sm mb-6">{userData.email}</p>
          <Button variant="primary" text="Editar Perfil" fullWidth />
        </div>

        {/* Formulario Derecho */}
        <div className="w-full md:w-2/3 bg-white rounded-3xl p-8 shadow-soft">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Información del Perfil</h3>
          <div className="border-b border-gray-100 pb-6 mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-4">Tu Información</h4>
            <InputBox label="Nombre Completo" value={userData.name} readOnly />
            <InputBox label="Email" value={userData.email} readOnly />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-4">Información de tu Mascota</h4>
            <InputBox label="Nombre de la Mascota" name="name" value={petData.name} onChange={handlePetChange} />
            <div className="flex gap-4">
               <div className="w-1/2">
                 <InputBox label="Especie" name="type" placeholder="Ej: perro" value={petData.type} onChange={handlePetChange} />
               </div>
               <div className="w-1/2">
                 <InputBox label="Edad (años)" name="age" type="number" value={petData.age} onChange={handlePetChange} />
               </div>
            </div>
            <InputBox label="Raza" name="breed" value={petData.breed} onChange={handlePetChange} />
            
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Foto de la Mascota</label>
              {/* TODO(Futuro): Añadir un componente para recortar (Crop) la imagen en un cuadrado perfecto antes de subirla */}
              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm text-gray-500" />
            </div>

            {message && <p className="text-brand-purple font-semibold my-2">{message}</p>}
            <div className="mt-6 flex justify-end">
              <Button variant="primary" text="Guardar Cambios" onClick={handleSavePet} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
