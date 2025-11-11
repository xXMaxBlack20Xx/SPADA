// Navegador del Main page (con logo, links, acciones, menú móvil, selector de idioma)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '@/assets/logo/spada.png';

// Se usa el Contexto Global de idioma (LanguageContext)
type Lang = 'es' | 'en' | 'zh';

const i18n: Record<
    Lang,
    {
        nav: { home: string; services: string; contact: string };
        login: string;
        signup: string;
    }
> = {
    es: {
        nav: { home: 'Inicio', services: 'Servicios', contact: 'Contacto' },
        login: 'Iniciar sesión',
        signup: 'Crear cuenta',
    },
    en: {
        nav: { home: 'Home', services: 'Services', contact: 'Contact' },
        login: 'Sign in',
        signup: 'Create account',
    },
    zh: {
        nav: { home: '首页', services: '服务', contact: '联系' },
        login: '登录',
        signup: '创建账户',
    },
};

// Componente Header
export default function Header() {
    const [open, setOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    // ⬇ idioma viene del contexto global
    const { lang, setLang } = useLanguage();
    const t = i18n[lang];

    const navigate = useNavigate();
    const go = (path: string) => {
        navigate(path);
        setOpen(false); // cierra el menú móvil si estaba abierto
        setLangOpen(false);
    };

    const navItems = [
        { href: '#inicio', label: t.nav.home },
        { href: '#servicios', label: t.nav.services },
        { href: '#contacto', label: t.nav.contact },
    ];

    // Clase utilitaria: “levitar con sombra blanca”
    const hoverLift =
        'relative transition transform hover:-translate-y-0.5 ' +
        'hover:shadow-[0_12px_40px_rgba(255,255,255,0.12)] ' +
        "after:content-[''] after:absolute after:inset-0 after:-z-10 " +
        'after:rounded-xl after:blur-xl after:opacity-0 hover:after:opacity-100 ' +
        'after:transition after:bg-white/10';

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            {/* Cinta superior glow */}
            <div className="h-0.5 w-full bg-linear-to-r from-[#7C3AED] via-[#A855F7] to-[#F97316]" />

            {/* Contenedor principal */}
            <div className="w-full bg-linear-to-b from-[#0B0A17] via-[#121024] to-[#1A132B]/95 backdrop-blur supports-backdrop-filter:backdrop-blur-md shadow-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Logo + Marca (clic -> home) */}
                    <button
                        onClick={() => go('/')}
                        className="flex items-center gap-3"
                        aria-label="Ir al inicio"
                    >
                        <img
                            src={Logo}
                            alt="SPADA"
                            className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]"
                        />
                        <span className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-linear-to-r from-white to-[#F5D0FE]">
                            SPADA
                        </span>
                    </button>

                    {/* Navegación Desktop (anclas internas de la landing) */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`relative text-m font-medium text-white/80 hover:text-white transition-colors ${hoverLift}`}
                            >
                                {item.label}
                                <span className="absolute -bottom-2 left-0 h-0.5 w-0 bg-linear-to-r from-[#A855F7] to-[#F97316] transition-all duration-300 hover:w-full" />
                            </a>
                        ))}
                    </nav>

                    {/* Acciones Desktop (navegación programática) */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Selector de idioma */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen((v) => !v)}
                                className={`px-3 py-2 text-m font-semibold rounded-xl border border-white/15 text-white/90 hover:text-white hover:border-white/25 transition flex items-center gap-2 ${hoverLift}`}
                                aria-expanded={langOpen}
                                aria-label="Cambiar idioma"
                            >
                                {/* Ícono globo */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M12 3a9 9 0 100 18 9 9 0 000-18Z" />
                                    <path d="M2.05 12h19.9M12 2.05v19.9M7 12a10.9 10.9 0 002.5 7.5M17 12A10.9 10.9 0 0114.5 4.5" />
                                </svg>
                                {lang.toUpperCase()}
                            </button>

                            {langOpen && (
                                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-white/10 bg-[#100E1E]/95 backdrop-blur shadow-[0_12px_40px_rgba(255,255,255,0.12)] p-1">
                                    {(
                                        [
                                            { id: 'es', label: 'Español' },
                                            { id: 'en', label: 'English' },
                                            { id: 'zh', label: '中文' },
                                        ] as { id: Lang; label: string }[]
                                    ).map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                setLang(opt.id);
                                                setLangOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-m text-white/90 hover:bg-white/10 transition"
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Login / Signup con useNavigate */}
                        <button
                            onClick={() => go('/login')}
                            className={`px-4 py-2 text-m font-semibold rounded-xl border border-white/15 text-white/90 hover:text-white hover:border-white/25 transition ${hoverLift}`}
                        >
                            {t.login}
                        </button>
                        <button
                            onClick={() => go('/signup')}
                            className={`px-4 py-2 text-m font-semibold rounded-xl bg-linear-to-r from-[#A855F7] via-[#7C3AED] to-[#F97316] hover:brightness-110 transition shadow-[0_0_24px_rgba(249,115,22,0.25)] ${hoverLift}`}
                        >
                            {t.signup}
                        </button>
                    </div>

                    {/* Botón móvil */}
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="md:hidden p-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 transition"
                        aria-label="Abrir menú"
                        aria-expanded={open}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            {open ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menú móvil */}
                {open && (
                    <div className="md:hidden border-t border-white/10">
                        <nav className="px-6 py-4 flex flex-col gap-3">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`text-base font-medium text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition ${hoverLift}`}
                                >
                                    {item.label}
                                </a>
                            ))}

                            {/* Selector de idioma en móvil */}
                            <div className="flex gap-2 pt-2">
                                {(['es', 'en', 'zh'] as Lang[]).map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setLang(opt);
                                            setOpen(false);
                                        }}
                                        className={`flex-1 text-center px-3 py-3 text-m font-semibold rounded-xl border border-white/15 text-white/90 hover:text-white hover:border-white/25 transition ${hoverLift} ${
                                            lang === opt ? 'bg-white/10' : 'bg-transparent'
                                        }`}
                                    >
                                        {opt.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => go('/login')}
                                    className={`flex-1 text-center px-4 py-3 text-m font-semibold rounded-xl border border-white/15 text-white/90 hover:text-white hover:border-white/25 transition ${hoverLift}`}
                                >
                                    {t.login}
                                </button>
                                <button
                                    onClick={() => go('/signup')}
                                    className={`flex-1 text-center px-4 py-3 text-m font-semibold rounded-xl bg-linear-to-r from-[#A855F7] via-[#7C3AED] to-[#F97316] hover:brightness-110 transition shadow-[0_0_24px_rgba(249,115,22,0.25)] ${hoverLift}`}
                                >
                                    {t.signup}
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
