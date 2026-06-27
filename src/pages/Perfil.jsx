import { useState, useEffect } from 'react';
import axios from 'axios';
import InputBox from '../components/InputBox';
import Button from '../components/Button';

const Perfil = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [petData, setPetData] = useState({ name: '', type: 'perro', breed: '', age: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [petId, setPetId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    // Obtenemos el nombre y correo del DUEÑO desde la base de datos
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    }).then(res => {
      setUserData({ name: res.data.name, email: res.data.email });
    }).catch(err => console.log(err));

    //Averiguamos si este dueño ya tiene una MASCOTA registrada
    axios.get(`${import.meta.env.VITE_API_URL}/api/pets/my-pets`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    }).then(res => {
      if (res.data.length > 0) {
        const myPet = res.data[0];
        setPetId(myPet._id);
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
      if(petId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/pets/${petId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('¡Perfil de mascota actualizado con éxito!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/pets`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('¡Perfil de mascota guardado con éxito!');
      }
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
        <div className="w-full max-w-sm mx-auto md:max-w-none md:w-1/3 md:mx-0 bg-white rounded-3xl p-6 shadow-soft flex flex-col items-center">
          <div className="w-60 h-48 md:w-40 md:h-50 bg-gradient-brand rounded-2xl mb-6 relative flex justify-center items-center overflow-hidden shadow-inner">
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

            <div className="flex justify-center items-center bg-gray-200 rounded-2xl w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 cursor-pointer hover:bg-gray-300 transition-colors rounded-2xl">
                {imagePreview ? (
                  <div className="flex flex-col items-center justify-center w-full h-full p-4">
                    <img src={imagePreview} alt="Vista previa" className="max-h-40 rounded-xl object-contain mb-2 shadow" />
                    <p className="text-sm text-gray-700 font-medium truncate max-w-[90%]">📎 {imageFile?.name}</p>
                    <p className="text-xs text-brand-purple mt-1">Click para cambiar la imagen</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2" /></svg>
                    <p className="mb-2 text-sm">Sube la foto de tu mascota</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
              </label>
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
