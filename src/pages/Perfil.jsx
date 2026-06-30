import { useEffect, useState } from "react";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { authApi, getApiError, petsApi } from "../services/api";

const emptyPet = {
  name: "",
  type: "perro",
  breed: "",
  age: "",
  sex: "desconocido",
  description: "",
  lookingFor: "amistad",
  status: "activo",
};

const buildPetFormData = (petData, files = []) => {
  const formData = new FormData();

  Object.entries(petData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  files.forEach((file) => {
    formData.append("photos", file);
  });

  return formData;
};

const Perfil = () => {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [petData, setPetData] = useState(emptyPet);
  const [petId, setPetId] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const [userRes, petsRes] = await Promise.all([authApi.me(), petsApi.listMine()]);
      setUserData({ name: userRes.data.name, email: userRes.data.email });

      const myPet = petsRes.data[0];
      if (myPet) {
        setPetId(myPet._id);
        setPetData({
          name: myPet.name || "",
          type: myPet.type || "perro",
          breed: myPet.breed || "",
          age: myPet.age ?? "",
          sex: myPet.sex || "desconocido",
          description: myPet.description || "",
          lookingFor: myPet.lookingFor || "amistad",
          status: myPet.status || "activo",
        });
        setPhotos(myPet.photos || []);
      } else {
        setPetId(null);
        setPetData(emptyPet);
        setPhotos([]);
      }
    } catch (err) {
      setError(getApiError(err, "No se pudo cargar tu perfil."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handlePetChange = (event) => {
    const { name, value } = event.target;
    setPetData((current) => ({ ...current, [name]: value }));
  };

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 6);
    setSelectedFiles(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const validatePet = () => {
    if (!petData.name.trim()) return "El nombre de la mascota es obligatorio.";
    if (!petData.breed.trim()) return "La raza es obligatoria.";
    if (petData.age === "" || Number(petData.age) < 0) return "La edad debe ser 0 o mayor.";
    if (petData.description.length > 500) return "La descripcion no puede superar 500 caracteres.";
    return "";
  };

  const handleSavePet = async () => {
    const validationError = validatePet();
    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const formData = buildPetFormData(petData, selectedFiles);
      const response = petId
        ? await petsApi.update(petId, formData)
        : await petsApi.create(formData);

      setPetId(response.data._id);
      setPhotos(response.data.photos || []);
      setSelectedFiles([]);
      setPreviews([]);
      setMessage(petId ? "Mascota actualizada correctamente." : "Mascota creada correctamente.");
    } catch (err) {
      setError(getApiError(err, "Hubo un error al guardar la mascota."));
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhotos = async () => {
    if (!petId || selectedFiles.length === 0) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("photos", file));
      const response = await petsApi.addPhotos(petId, formData);
      setPhotos(response.data.photos || []);
      setSelectedFiles([]);
      setPreviews([]);
      setMessage("Fotos agregadas correctamente.");
    } catch (err) {
      setError(getApiError(err, "No se pudieron agregar las fotos."));
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async (photoUrl) => {
    if (!petId) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await petsApi.removePhoto(petId, photoUrl);
      setPhotos(response.data.photos || []);
      setMessage("Foto eliminada correctamente.");
    } catch (err) {
      setError(getApiError(err, "No se pudo eliminar la foto."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePet = async () => {
    if (!petId) return;
    const confirmed = window.confirm("Quieres eliminar esta mascota?");
    if (!confirmed) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await petsApi.remove(petId);
      setPetId(null);
      setPetData(emptyPet);
      setPhotos([]);
      setSelectedFiles([]);
      setPreviews([]);
      setMessage("Mascota eliminada correctamente.");
    } catch (err) {
      setError(getApiError(err, "No se pudo eliminar la mascota."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-brand-purple font-bold text-xl animate-pulse">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">
          Edita tu informacion y administra el perfil de tu mascota
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full max-w-sm mx-auto md:max-w-none md:w-1/3 md:mx-0 bg-white rounded-3xl p-6 shadow-soft flex flex-col items-center">
          <div className="w-60 h-48 md:w-44 md:h-44 bg-gradient-brand rounded-2xl mb-6 relative flex justify-center items-center overflow-hidden shadow-inner">
            {photos[0] ? (
              <img src={photos[0]} alt="Mascota" className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl">P</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{userData.name || "Sin nombre"}</h2>
          <p className="text-gray-500 text-sm mb-2">{userData.email}</p>
          <p className="text-xs text-gray-400 text-center">
            El backend asocia tus mascotas con tu usuario autenticado.
          </p>
        </div>

        <div className="w-full md:w-2/3 bg-white rounded-3xl p-8 shadow-soft">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Informacion del Perfil</h3>

          <div className="border-b border-gray-100 pb-6 mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-4">Tu Informacion</h4>
            <InputBox label="Nombre Completo" value={userData.name} readOnly />
            <InputBox label="Email" value={userData.email} readOnly />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-4">Informacion de tu Mascota</h4>
            <InputBox label="Nombre de la Mascota" name="name" value={petData.name} onChange={handlePetChange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 mb-4">
                <span className="text-sm font-semibold text-gray-700">Tipo</span>
                <select name="type" value={petData.type} onChange={handlePetChange} className="px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-brand-purple">
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                  <option value="otro">Otro</option>
                </select>
              </label>

              <InputBox label="Edad" name="age" type="number" value={petData.age} onChange={handlePetChange} />
            </div>

            <InputBox label="Raza" name="breed" value={petData.breed} onChange={handlePetChange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 mb-4">
                <span className="text-sm font-semibold text-gray-700">Sexo</span>
                <select name="sex" value={petData.sex} onChange={handlePetChange} className="px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-brand-purple">
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                  <option value="desconocido">Desconocido</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 mb-4">
                <span className="text-sm font-semibold text-gray-700">Busca</span>
                <select name="lookingFor" value={petData.lookingFor} onChange={handlePetChange} className="px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-brand-purple">
                  <option value="amistad">Amistad</option>
                  <option value="pareja">Pareja</option>
                  <option value="paseos">Paseos</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1 mb-4">
              <span className="text-sm font-semibold text-gray-700">Descripcion</span>
              <textarea
                name="description"
                value={petData.description}
                onChange={handlePetChange}
                maxLength={500}
                rows={4}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-brand-purple resize-none"
              />
            </label>

            <label className="flex flex-col gap-1 mb-4">
              <span className="text-sm font-semibold text-gray-700">Estado</span>
              <select name="status" value={petData.status} onChange={handlePetChange} className="px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-brand-purple">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>

            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5">
              <label htmlFor="pet-photos" className="block cursor-pointer text-center">
                <span className="block text-sm font-semibold text-gray-700">Fotos de la mascota</span>
                <span className="block text-xs text-gray-500 mt-1">JPG, PNG, JPEG o WEBP. Maximo 5MB por imagen.</span>
                <input id="pet-photos" type="file" accept="image/*" multiple onChange={handleFilesChange} className="hidden" />
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {previews.map((preview, index) => (
                    <img key={preview} src={preview} alt={`Vista previa ${index + 1}`} className="h-28 w-full object-cover rounded-xl" />
                  ))}
                </div>
              )}
            </div>

            {photos.length > 0 && (
              <div className="mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Galeria actual</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((photo) => (
                    <div key={photo} className="relative rounded-xl overflow-hidden h-28">
                      <img src={photo} alt="Foto de mascota" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo)}
                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full px-3 py-1 text-xs font-bold"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {message && <p className="text-brand-purple font-semibold my-4">{message}</p>}
            {error && <p className="text-red-600 font-semibold my-4">{error}</p>}

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              {petId && selectedFiles.length > 0 && (
                <Button variant="outline" text="Agregar fotos" onClick={handleAddPhotos} />
              )}
              {petId && (
                <button
                  type="button"
                  onClick={handleDeletePet}
                  disabled={saving}
                  className="px-6 py-3 rounded-full font-semibold border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  Eliminar mascota
                </button>
              )}
              <Button variant="primary" text={saving ? "Guardando..." : "Guardar Cambios"} onClick={handleSavePet} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
