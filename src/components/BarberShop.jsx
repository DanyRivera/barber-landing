import { useState, useEffect, useRef } from "react";

// ─── Constantes ───────────────────────────────────────────────
const ORANGE = "#f05a1a";

const NAV_LINKS = [
  { href: "#inicio",    label: "Inicio" },
  { href: "#trabajos",  label: "Trabajos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#equipo",    label: "Equipo" },
  { href: "#opiniones", label: "Opiniones" },
  { href: "#contacto",  label: "Contacto" },
];

const STATS = [
  { target: 5000, label: "Clientes felices", suffix: "+" },
  { target: 8,    label: "Años de experiencia", suffix: "" },
  { target: 12,   label: "Maestros barberos", suffix: "" },
  { target: 3,    label: "Sucursales", suffix: "" },
];

const GALLERY_ITEMS = [
  { label: "Fade Clásico" },
  { label: "Afeitado" },
  { label: "Barba" },
  { label: "Pompadour" },
  { label: "Crew Cut" },
];

const PRICE_TABS = [
  { id: "barba",  label: "Barba" },
  { id: "cortes", label: "Cortes" },
  { id: "cera",   label: "Cera" },
  { id: "tinte",  label: "Tinte" },
  { id: "combo",  label: "Combo" },
];

const PRICES = {
  barba: [
    { name: "Modelado de barba", sub: "sin extensiones", desc: "Diseño de contornos, perfilado con navaja. Cosmética profesional American Crew.", price: "$350" },
    { name: "Modelado de barba", sub: "con extensiones", desc: "Incluye extensiones naturales, contornos suaves con navaja profesional.", price: "$280" },
    { name: "Afeitado con navaja clásica", sub: "", desc: "Toalla caliente, espuma artesanal y acabado con bálsamo hidratante.", price: "$220" },
  ],
  cortes: [
    { name: "Corte clásico", sub: "", desc: "Corte de tijera o maquinilla con acabado perfecto. Incluye lavado y secado.", price: "$300" },
    { name: "Fade / Degradado", sub: "", desc: "Degradado perfecto de bajo a alto. Incluye diseño de líneas y contornos.", price: "$380" },
    { name: "Corte infantil", sub: "", desc: "Para los pequeños barberos. Corte cuidadoso y divertido.", price: "$180" },
  ],
  cera: [
    { name: "Depilación de nariz", sub: "", desc: "Eliminación rápida e indolora con cera natural.", price: "$120" },
    { name: "Depilación de orejas", sub: "", desc: "Tratamiento rápido con cera de alta calidad.", price: "$100" },
  ],
  tinte: [
    { name: "Tinte completo de cabello", sub: "", desc: "Coloración profesional con productos de alta gama. Consulta de color incluida.", price: "$650" },
    { name: "Mechas / Balayage", sub: "", desc: "Iluminaciones naturales o balayage personalizado.", price: "$800" },
  ],
  combo: [
    { name: "Combo Caballero", sub: "Popular", desc: "Corte + arreglo de barba + lavado. El paquete favorito de nuestros clientes.", price: "$520", highlight: true },
    { name: "Combo Premium", sub: "", desc: "Corte + barba + SPA facial + masaje de cuero cabelludo.", price: "$780" },
  ],
};

const TEAM = [
  { name: "Carlos Mendoza", role: "Maestro Barbero", desc: "10 años de experiencia. Especialista en fades y diseños artísticos.", initials: "CM" },
  { name: "Diego Ramírez",  role: "Barbero Senior",  desc: "Experto en barba tradicional y afeitado con navaja clásica.", initials: "DR" },
  { name: "Alejandro Torres", role: "Estilista",     desc: "Especializado en colorimetría y tendencias de moda masculina.", initials: "AT" },
  { name: "Luis Herrera",   role: "Barbero Junior",  desc: "Talento emergente con técnica impecable y creatividad única.", initials: "LH" },
];

const REVIEWS = [
  { text: "El mejor barbero que he visitado en años. Carlos me hizo un fade increíble y la atención fue de primera. Ya tengo mi cita para el mes que viene.", name: "Juan Morales", role: "Cliente habitual", initials: "JM", stars: 5, bg: ORANGE },
  { text: "Probé el Combo Premium y fue una experiencia increíble. El SPA facial me relajó por completo. El ambiente del local es muy profesional y cálido.", name: "Roberto López", role: "Nuevo cliente", initials: "RL", stars: 5, bg: "#333" },
  { text: "Llevo 2 años yendo a CASS y nunca me han decepcionado. Diego con la navaja clásica es un artista. El precio está muy justo para la calidad que ofrecen.", name: "Andrés García", role: "Cliente VIP", initials: "AG", stars: 4, bg: "#2a4a6b" },
];

const MARQUEE_ITEMS = ["CORTE DE CABELLO", "ARREGLO DE BARBA", "ESTILISMO", "SPA FACIAL", "TINTE", "DEGRADADO", "AFEITADO"];

const HORARIOS = ["10:00 am","11:00 am","12:00 pm","1:00 pm","3:00 pm","4:00 pm","5:00 pm","6:00 pm"];

// ─── Hooks ────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target, active, suffix = "") {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(p < 1 ? Math.floor(eased * target) : target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);
  return val === target ? `${target.toLocaleString()}${suffix}` : val.toLocaleString();
}

// ─── Pequeños componentes ────────────────────────────────────
function AccentLine() {
  return <span className="inline-block w-12 h-1 rounded-sm mr-3 align-middle" style={{ background: ORANGE }} />;
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <AccentLine />
      <span className="text-xs tracking-[3px] uppercase font-semibold" style={{ color: ORANGE, fontFamily: "'Oswald', sans-serif" }}>{children}</span>
    </div>
  );
}

function SectionTitle({ children, className = "" }) {
  return (
    <h2 className={`text-white leading-none ${className}`}
      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(42px,7vw,80px)", letterSpacing: 1 }}>
      {children}
    </h2>
  );
}

function StarRating({ count }) {
  return (
    <div className="flex gap-1 mb-4">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-4 h-4" fill={i <= count ? ORANGE : "#444"} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

// Ícono tijeras
function ScissorsIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"/>
    </svg>
  );
}

// Ícono persona
function PersonIcon({ className = "w-12 h-12" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  );
}

// Reveal wrapper
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity .7s ${delay}s cubic-bezier(.16,1,.3,1), transform .7s ${delay}s cubic-bezier(.16,1,.3,1)`,
      }}>
      {children}
    </div>
  );
}

// ─── Secciones ────────────────────────────────────────────────

// NAV
function Navbar({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{
        background: scrolled ? "rgba(10,10,10,0.98)" : "rgba(17,17,17,0.85)",
        paddingTop: "env(safe-area-inset-top)",
        backdropFilter: "blur(12px)",
        transition: "background .3s",
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#inicio" style={{ fontFamily: "'Bebas Neue',sans-serif", color: ORANGE, fontSize: 26, letterSpacing: 4 }}>CASS</a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => <NavLink key={l.href} {...l} />)}
          </div>

          <a href="#contacto"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-lg text-sm text-white font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5"
            style={{ background: ORANGE, fontFamily: "'Oswald',sans-serif" }}>
            Reservar cita
          </a>

          {/* Hamburger */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(o => !o)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden overflow-hidden transition-all duration-400"
        style={{ maxHeight: menuOpen ? 400 : 0, opacity: menuOpen ? 1 : 0 }}>
        <div className="px-4 pb-4 space-y-2">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block py-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-sm"
              style={{ fontFamily: "'Oswald',sans-serif" }}>{l.label}</a>
          ))}
          <a href="#contacto" onClick={() => setMenuOpen(false)}
            className="block text-center py-3 rounded-lg text-white font-bold uppercase tracking-wide mt-2"
            style={{ background: ORANGE, fontFamily: "'Oswald',sans-serif" }}>
            Reservar cita
          </a>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label }) {
  return (
    <a href={href} className="relative group text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider"
      style={{ fontFamily: "'Oswald',sans-serif" }}>
      {label}
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
        style={{ background: ORANGE }} />
    </a>
  );
}

// HERO
function Hero() {
  return (
    <section id="inicio" className="min-h-screen flex flex-col justify-center relative pt-16 overflow-hidden"
      style={{ background: "#111111" }}>
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "300px" }} />
      {/* Orange glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: ORANGE, transform: "translate(40%,-40%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4" style={{ animation: "slideUp .8s .1s both" }}>
              <AccentLine />
              <span className="text-xs tracking-[3px] uppercase" style={{ color: ORANGE, fontFamily: "'Oswald',sans-serif" }}>Estilo Premium para Hombres</span>
            </div>

            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(72px,15vw,180px)", lineHeight: .92, letterSpacing: -2, animation: "slideUp .8s both" }}>
              <span className="text-white">BARBER</span>
              <br />
              <span style={{ background: `linear-gradient(90deg,#fff 30%,${ORANGE} 50%,#fff 70%)`, backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite, slideUp .8s .15s both" }}>
                SHOP
              </span>
            </h1>

            <p className="mt-6 text-gray-400 text-base leading-relaxed max-w-md" style={{ animation: "slideUp .8s .2s both" }}>
              CASS es una red de barberías artesanales. Realizamos cortes masculinos de calidad, servicios de arreglo de barba y procedimientos SPA facial con cosméticos profesionales.
            </p>

            <div className="flex flex-wrap gap-4 mt-8" style={{ animation: "fadeIn .8s .4s both" }}>
              <a href="#contacto"
                className="px-8 py-4 rounded-xl text-white font-bold uppercase tracking-wide transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: ORANGE, fontFamily: "'Oswald',sans-serif", fontSize: 15, boxShadow: "0 0 0 0 rgba(240,90,26,.5)", animation: "pulseCTA 2.5s 1.5s ease-in-out infinite" }}>
                Reservar cita
              </a>
              <a href="#trabajos"
                className="px-8 py-4 rounded-xl text-gray-300 border border-gray-600 hover:border-gray-400 hover:text-white transition-all uppercase tracking-wide"
                style={{ fontFamily: "'Oswald',sans-serif", fontSize: 14 }}>
                Ver trabajos
              </a>
            </div>

            {/* Discount badge */}
            <a href="#servicios"
              className="block mt-6 rounded-xl p-4 border border-gray-700 hover:border-orange-500 transition-all cursor-pointer flex items-center justify-between gap-4"
              style={{ background: "#222", animation: "slideRight .8s .35s both", borderColor: "#333" }}>
              <div>
                <p className="font-bold text-white" style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18 }}>🔥 Descuento 20%</p>
                <p className="text-gray-500 text-sm mt-1">En tu primera visita. Detalles en la sección «Promociones»</p>
              </div>
              <svg className="w-5 h-5 flex-shrink-0" style={{ color: ORANGE }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
          </div>

          {/* Right: visual mosaic */}
          <div className="grid grid-cols-2 gap-3" style={{ animation: "scaleIn .7s .2s both" }}>
            <div className="col-span-2 h-52 sm:h-64 rounded-xl flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg,#1a1a1a,#2a2a2a)" }}>
              <ScissorsIcon className="w-16 h-16 mb-3" style={{ color: ORANGE, animation: "float 3s ease-in-out infinite" }} />
              <span style={{ color: ORANGE, fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 3 }}>CORTE PREMIUM</span>
            </div>
            {["ESTILISMO","BARBA"].map(t => (
              <div key={t} className="h-36 sm:h-44 rounded-xl flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg,#1e1e1e,#282828)" }}>
                <PersonIcon className="w-10 h-10 mb-2" style={{ color: "#333" }} />
                <span style={{ color: "#3a3a3a", fontFamily: "'Oswald'", fontSize: 13, letterSpacing: 2 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ animation: "fadeIn 1s .8s both" }}>
        <span className="text-gray-600 text-xs tracking-widest uppercase" style={{ fontFamily: "'Oswald'" }}>Scroll</span>
        <div className="w-px h-10 overflow-hidden bg-gray-800">
          <div className="w-full h-1/2" style={{ background: ORANGE, animation: "scrollDrop 1.5s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

// MARQUEE
function MarqueeBand() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="py-5 overflow-hidden border-y border-gray-800" style={{ background: "#161616" }}>
      <div className="flex w-max" style={{ animation: "marquee 20s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 3, padding: "0 40px", color: i % 2 === 0 ? "#2a2a2a" : ORANGE }}>
            {i % 2 === 0 ? item : "✦"}
          </span>
        ))}
      </div>
    </div>
  );
}

// STATS
function StatItem({ target, label, suffix }) {
  const [ref, visible] = useInView(0.3);
  const val = useCounter(target, visible, suffix);
  return (
    <div ref={ref} className="text-center">
      <p style={{ fontFamily: "'Bebas Neue'", fontSize: 56, color: ORANGE, lineHeight: 1 }}>{val}</p>
      <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald'" }}>{label}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="py-16" style={{ background: "#161616" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => <StatItem key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}

// GALLERY
function GalleryCard({ label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative h-56 sm:h-64 rounded-xl overflow-hidden cursor-pointer"
      style={{ background: "linear-gradient(135deg,#1a1a1a,#2d2d2d)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
        style={{ filter: hovered ? "brightness(1.2)" : "none" }}>
        <PersonIcon className="w-12 h-12 mb-2 transition-all duration-300"
          style={{ color: hovered ? ORANGE : "#333", transform: hovered ? "scale(1.1)" : "scale(1)" }} />
        <span className="transition-colors duration-300" style={{ color: hovered ? ORANGE : "#3a3a3a", fontFamily: "'Oswald'", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
      <span className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,.6)", color: "#aaa" }}>Estilismo</span>
    </div>
  );
}

function Gallery() {
  return (
    <section id="trabajos" className="py-24" style={{ background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionLabel>Galería</SectionLabel></Reveal>
        <Reveal delay={0.05}><SectionTitle className="mb-3">NUESTROS TRABAJOS</SectionTitle></Reveal>
        <Reveal delay={0.1}><p className="text-gray-500 mb-12 max-w-lg">Cada corte es una obra de arte. Descubre el trabajo de nuestros maestros barberos.</p></Reveal>

        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GALLERY_ITEMS.map(g => <GalleryCard key={g.label} label={g.label} />)}
            {/* CTA tile */}
            <a href="#contacto"
              className="h-56 sm:h-64 rounded-xl flex flex-col items-center justify-center group transition-all hover:brightness-90"
              style={{ background: ORANGE }}>
              <svg className="w-10 h-10 mb-3 text-white transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span className="text-white font-bold text-center px-4" style={{ fontFamily: "'Oswald'", fontSize: 18, letterSpacing: 1, textTransform: "uppercase", lineHeight: 1.3 }}>
                Reservar<br />un corte
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// PRICES
function PriceRow({ name, sub, desc, price, highlight }) {
  return (
    <div className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all hover:-translate-y-1"
      style={{ background: "#222", borderLeft: highlight ? `3px solid ${ORANGE}` : "none" }}>
      <div>
        <p className="font-semibold text-white" style={{ fontFamily: "'Oswald'", fontSize: 17 }}>
          {name}
          {sub && <span className="font-normal text-gray-500 text-sm ml-1">({sub})</span>}
          {highlight && <span className="text-xs px-2 py-0.5 rounded-full ml-2" style={{ background: `rgba(240,90,26,.15)`, color: ORANGE }}>Popular</span>}
        </p>
        <p className="text-gray-500 text-sm mt-1 max-w-md">{desc}</p>
      </div>
      <span className="flex-shrink-0 font-bold" style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: ORANGE, letterSpacing: 1 }}>{price}</span>
    </div>
  );
}

function Prices() {
  const [activeTab, setActiveTab] = useState("barba");
  return (
    <section id="servicios" className="py-24" style={{ background: "#161616" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionLabel>Lo que ofrecemos</SectionLabel></Reveal>
        <Reveal delay={0.05}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <SectionTitle>
              SERVICIOS <span style={{ color: ORANGE }}>&amp; PRECIOS</span>
            </SectionTitle>
            <ScissorsIcon className="hidden sm:block w-16 h-16 opacity-20" style={{ color: ORANGE, animation: "float 4s ease-in-out infinite" }} />
          </div>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-1 border-b border-gray-800 mb-8 overflow-x-auto">
            {PRICE_TABS.map(t => (
              <button key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
                style={{
                  fontFamily: "'Oswald',sans-serif", letterSpacing: 1, textTransform: "uppercase",
                  color: activeTab === t.id ? ORANGE : "#9ca3af",
                  borderColor: activeTab === t.id ? ORANGE : "transparent",
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="space-y-3">
            {(PRICES[activeTab] || []).map((item, i) => <PriceRow key={i} {...item} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// TEAM
function TeamCard({ name, role, desc, initials }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ background: "#1e1e1e", transform: hovered ? "translateY(-8px)" : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="h-52 flex items-center justify-center" style={{ background: "#252525" }}>
        <PersonIcon className="w-20 h-20 transition-transform duration-300" style={{ color: "#333", transform: hovered ? "scale(1.1)" : "scale(1)" }} />
      </div>
      <div className="p-5">
        <p className="font-bold text-white text-lg" style={{ fontFamily: "'Oswald'" }}>{name}</p>
        <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: ORANGE, fontFamily: "'Oswald'" }}>{role}</p>
        <p className="text-gray-500 text-sm mt-2">{desc}</p>
      </div>
    </div>
  );
}

function Team() {
  return (
    <section id="equipo" className="py-24" style={{ background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionLabel>Nuestros artistas</SectionLabel></Reveal>
        <Reveal delay={0.05}><SectionTitle className="mb-12">NUESTRO EQUIPO</SectionTitle></Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(m => <TeamCard key={m.name} {...m} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// REVIEWS
function ReviewCard({ text, name, role, initials, stars, bg }) {
  return (
    <div className="rounded-xl p-6 transition-all hover:-translate-y-1" style={{ background: "#222" }}>
      <StarRating count={stars} />
      <p className="text-gray-300 text-sm leading-relaxed mb-4">"{text}"</p>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: bg, fontFamily: "'Oswald'" }}>{initials}</div>
        <div>
          <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Oswald'" }}>{name}</p>
          <p className="text-gray-600 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

function Reviews() {
  return (
    <section id="opiniones" className="py-24" style={{ background: "#161616" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionLabel>Lo que dicen</SectionLabel></Reveal>
        <Reveal delay={0.05}><SectionTitle className="mb-12">OPINIONES</SectionTitle></Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map(r => <ReviewCard key={r.name} {...r} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// CONTACT
function Contact() {
  const [form, setForm] = useState({ nombre: "", telefono: "", servicio: "", fecha: "", hora: "", comentario: "" });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  const inputClass = "w-full rounded-lg px-4 py-3 text-white text-sm outline-none transition-all border focus:border-orange-500";
  const inputStyle = { background: "#252525", borderColor: "#333", fontFamily: "'Inter',sans-serif" };

  return (
    <section id="contacto" className="py-24" style={{ background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal><SectionLabel>Reserva tu lugar</SectionLabel></Reveal>
        <Reveal delay={0.05}><SectionTitle className="mb-4">RESERVAR CITA</SectionTitle></Reveal>
        <Reveal delay={0.1}><p className="text-gray-500 mb-12 max-w-lg">Completa el formulario y uno de nuestros barberos te confirmará por WhatsApp en menos de 2 horas.</p></Reveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <Reveal delay={0.15}>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} className={inputClass} style={inputStyle} />
                <input name="telefono" placeholder="Teléfono / WhatsApp" value={form.telefono} onChange={handleChange} className={inputClass} style={inputStyle} />
              </div>
              <select name="servicio" value={form.servicio} onChange={handleChange} className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="" disabled>Selecciona un servicio</option>
                {["Corte clásico","Fade / Degradado","Arreglo de barba","Afeitado con navaja","Combo Caballero","Combo Premium","Tinte / Coloración"].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className={inputClass} style={inputStyle} />
                <select name="hora" value={form.hora} onChange={handleChange} className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" disabled>Horario</option>
                  {HORARIOS.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
              <textarea name="comentario" rows={3} placeholder="Algún comentario o solicitud especial..." value={form.comentario} onChange={handleChange}
                className={`${inputClass} resize-none`} style={inputStyle} />
              <button onClick={handleSubmit}
                className="w-full py-4 rounded-xl text-white font-bold uppercase tracking-wide text-base transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: ORANGE, fontFamily: "'Oswald',sans-serif", boxShadow: "0 8px 24px rgba(240,90,26,.3)" }}>
                Enviar solicitud de cita
              </button>
              <p className="text-gray-600 text-xs text-center">Te confirmaremos por WhatsApp en menos de 2 horas.</p>
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.2}>
            <div className="space-y-6">
              <div className="rounded-xl p-6" style={{ background: "#222" }}>
                <h3 className="text-white font-semibold mb-5" style={{ fontFamily: "'Oswald'", fontSize: 20 }}>Información de contacto</h3>
                {[
                  { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", title: "Dirección", lines: ["Av. Insurgentes Norte 123, Col. Centro, CDMX"] },
                  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Horario", lines: ["Lun – Vie: 10:00 am – 8:00 pm", "Sáb – Dom: 10:00 am – 6:00 pm"] },
                  { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "WhatsApp", lines: ["+52 55 1234 5678"] },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4 mb-5 last:mb-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `rgba(240,90,26,.12)` }}>
                      <svg className="w-5 h-5" style={{ color: ORANGE }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      {item.lines.map(l => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo */}
              <div className="rounded-xl p-6 relative overflow-hidden" style={{ background: ORANGE }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 pointer-events-none" style={{ background: "#fff", transform: "translate(30%,-30%)" }} />
                <p className="text-white font-bold mb-1" style={{ fontFamily: "'Bebas Neue'", fontSize: 26, letterSpacing: 2 }}>🔥 20% DE DESCUENTO</p>
                <p className="text-orange-100 text-sm">En tu primera visita. Menciona este código al reservar:</p>
                <p className="text-white font-bold mt-2 text-lg tracking-widest" style={{ fontFamily: "'Oswald'" }}>CASS-NUEVO</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Toast */}
      <div className="fixed bottom-6 right-6 z-50 transition-all duration-300"
        style={{ opacity: sent ? 1 : 0, transform: sent ? "translateY(0)" : "translateY(16px)", pointerEvents: sent ? "auto" : "none" }}>
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl" style={{ background: "#1a1a1a", border: `1px solid ${ORANGE}` }}>
          <svg className="w-5 h-5" style={{ color: ORANGE }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
          <p className="text-white text-sm font-medium">¡Solicitud enviada! Te contactaremos pronto.</p>
        </div>
      </div>
    </section>
  );
}

// FOOTER
function Footer() {
  return (
    <footer className="py-12 border-t border-gray-900" style={{ background: "#0d0d0d" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <span style={{ fontFamily: "'Bebas Neue'", color: ORANGE, fontSize: 32, letterSpacing: 4 }}>CASS</span>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed max-w-xs">Red de barberías artesanales. Calidad, estilo y atención personalizada en cada visita.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-4 uppercase tracking-widest text-sm" style={{ fontFamily: "'Oswald'" }}>Navegación</p>
            <div className="space-y-2">
              {NAV_LINKS.map(l => (
                <a key={l.href} href={l.href} className="block text-gray-600 text-sm hover:text-white transition-colors">{l.label}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white font-semibold mb-4 uppercase tracking-widest text-sm" style={{ fontFamily: "'Oswald'" }}>Redes sociales</p>
            <div className="flex gap-3">
              {["instagram","facebook","tiktok"].map(net => (
                <a key={net} href="#" className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-700 text-gray-500 hover:text-orange-500 hover:border-orange-500 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {net === "instagram" && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>}
                    {net === "facebook" && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>}
                    {net === "tiktok" && <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-700 text-xs">© 2025 CASS BARBER SHOP. Todos los derechos reservados.</p>
          <p className="text-gray-700 text-xs">Diseñado con ✦ para los que saben verse bien</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Estilos globales (keyframes) ─────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

  html { scroll-behavior: smooth; }
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(.9); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes pulseCTA {
    0%, 100% { box-shadow: 0 0 0 0 rgba(240,90,26,.5); }
    50%       { box-shadow: 0 0 0 16px rgba(240,90,26,0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes scrollDrop {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(200%); }
  }

  input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(.4); }
  select option { background: #252525; }
`;

// ─── Componente principal ─────────────────────────────────────
export default function BarberShop() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ background: "#111111", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Hero />
        <MarqueeBand />
        <Stats />
        <Gallery />
        <Prices />
        <Team />
        <Reviews />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
