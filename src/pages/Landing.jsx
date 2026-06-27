import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const navItems = [
  { href: '#features', label: 'Caracteristicas' },
  { href: '#how-it-works', label: 'Como funciona' },
  { href: '#gallery', label: 'Galeria' },
];

const highlights = [
  { icon: '🐶', label: 'Amigos cercanos' },
  { icon: '📍', label: 'Busqueda local' },
  { icon: '💬', label: 'Chat directo' },
  { icon: '🔒', label: 'Cuenta segura' },
];

const features = [
  {
    icon: '✨',
    title: 'Perfiles vistosos',
    description: 'Muestra fotos y datos clave de tu mascota para encontrar el match ideal.',
  },
  {
    icon: '📅',
    title: 'Encuentros planeados',
    description: 'Organiza paseos y actividades con otros duenos en tu zona.',
  },
  {
    icon: '⚡',
    title: 'Navegacion sencilla',
    description: 'Interfaz clara para que puedas usar Pettin sin complicaciones.',
  },
  {
    icon: '📣',
    title: 'Comunicacion directa',
    description: 'Contacta facilmente con otros usuarios para coordinar citas.',
  },
];

const steps = [
  {
    title: '1. Registrate',
    description: 'Empieza creando tu cuenta con solo tu correo.',
  },
  {
    title: '2. Completa el perfil',
    description: 'Agrega datos de tu mascota y comparte sus fotos favoritas.',
  },
  {
    title: '3. Conecta y pasea',
    description: 'Busca matches y coordina encuentros con otros duenos.',
  },
];

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=900&q=80',
    alt: 'Perros jugando',
  },
  {
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80',
    alt: 'Dueno y mascota descansando',
  },
  {
    src: 'https://cdn.unotv.com/images/2024/11/paseo-174224.jpeg',
    alt: 'Paseo con gato',
  },
  {
    src: 'https://images.unsplash.com/photo-1471115853179-bb1d604434e0?auto=format&fit=crop&w=900&q=80',
    alt: 'Mascota en una aventura al aire libre',
  },
];

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fbf8ff_28%,#efe4ff_54%,#c08cff_78%,#8A2BE2_100%)] text-gray-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-2xl text-white shadow-soft">
            🐾
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-bold leading-tight">Pettin</span>
            <span className="block truncate text-sm text-gray-500">Tu comunidad de mascotas</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full transition-colors hover:text-brand-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-4">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2">
            Iniciar sesion
          </Link>
          <Link to="/registro">
            <Button text="Registrarse" variant="primary" />
          </Link>
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-700 shadow-sm transition hover:border-brand-purple hover:text-brand-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 md:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '×' : '☰'}
        </button>
      </header>

      {menuOpen && (
        <div className="mx-4 mb-6 rounded-3xl border border-gray-200 bg-white/95 px-6 py-4 shadow-soft backdrop-blur-md sm:mx-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu} className="rounded-xl py-1 text-gray-700 transition-colors hover:text-brand-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple">
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
              <Link to="/login" onClick={closeMenu} className="rounded-xl py-1 text-gray-700 transition-colors hover:text-brand-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple">
                Iniciar sesion
              </Link>
              <Link to="/registro" onClick={closeMenu} className="w-full">
                <Button text="Registrarse" variant="primary" fullWidth />
              </Link>
            </div>
          </div>
        </div>
      )}

      <main>
        <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-10">
          <div className="space-y-6">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-brand-purple shadow-soft">
              Nuevas conexiones para tu mascota
            </span>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Tu mascota, su comunidad y aventuras en un solo lugar.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Descubre amigos cercanos, organiza paseos y comparte momentos inolvidables con otros duenos que aman a sus mascotas tanto como tu.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/registro" className="inline-flex w-full sm:w-auto">
                <Button text="Crear cuenta" variant="primary" fullWidth />
              </Link>
              <Link to="/login" className="inline-flex w-full sm:w-auto">
                <Button text="Iniciar sesion" variant="outline" fullWidth />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {highlights.map((item) => (
                <div key={item.label} className="group rounded-2xl bg-white/90 p-4 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
                  <p className="text-3xl leading-none">{item.icon}</p>
                  <p className="mt-3 text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="overflow-hidden rounded-[2rem] shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80"
                alt="Dueno con perro feliz"
                className="h-72 w-full object-cover sm:h-96 lg:h-[420px]"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="overflow-hidden rounded-3xl shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80"
                  alt="Juego de mascotas"
                  className="h-48 w-full object-cover sm:h-52"
                />
              </div>
              <div className="overflow-hidden rounded-3xl shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <img
                  src="https://cdn.unotv.com/images/2024/11/paseo-174224.jpeg"
                  alt="Paseo con gato"
                  className="h-48 w-full object-cover sm:h-52"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto mt-8 w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-purple sm:text-sm sm:tracking-[0.35em]">
                Caracteristicas
              </p>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Todo lo que necesitas para cuidar y conectar a tu mascota.
              </h2>
              <p className="max-w-xl leading-7 text-gray-600">
                Desde encontrar companeros de juego hasta gestionar su perfil y mascotas favoritas, Pettin te acompana con una experiencia amigable, rapida y segura.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((card) => (
                <article key={card.title} className="group rounded-2xl bg-white/95 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <p className="text-4xl leading-none">{card.icon}</p>
                  <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-white/95 p-6 shadow-soft sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-purple sm:text-sm sm:tracking-[0.35em]">
                  Como funciona
                </p>
                <h3 className="text-3xl font-bold leading-tight">
                  Registrate, crea tu perfil y encuentra actividades a la medida.
                </h3>
                <p className="leading-7 text-gray-600">
                  Disenado para duenos reales y sus mascotas. Pettin te da las herramientas para descubrir amigos, organizar paseos y mantener todo en un solo lugar.
                </p>
              </div>
              <div className="grid gap-4">
                {steps.map((step) => (
                  <article key={step.title} className="rounded-2xl border border-gray-100 bg-[#fbf8ff] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="gallery"
          className="relative mt-10 overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36"
        >
          <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75 sm:text-sm sm:tracking-[0.35em]">
                Galeria dinamica
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                Mira como tus mascotas pueden divertirse juntas.
              </h2>
            </div>
            <Link to="/registro" className="inline-flex w-full shrink-0 sm:w-auto">
              <Button text="Empieza ahora" variant="primary" fullWidth />
            </Link>
          </div>
          <div className="relative mx-auto mt-8 grid w-full max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image) => (
              <div key={image.src} className="overflow-hidden rounded-3xl shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <img className="h-56 w-full object-cover sm:h-64 lg:h-72" src={image.src} alt={image.alt} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
