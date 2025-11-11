import type { JSX } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import imageSrc from '@/assets/img/main/main_stats.png';

type Lang = 'es' | 'en' | 'zh';

const i18n: Record<
    Lang,
    {
        eyebrow: string;
        title: string;
        body: JSX.Element;
        imageAlt: string;
    }
> = {
    es: {
        eyebrow: '¿Qué es SPADA?',
        title: 'Sistema de Predicción y Análisis Deportivo Avanzado',
        body: (
            <>
                SPADA es una plataforma inteligente que analiza miles de datos en tiempo real para
                ofrecerte predicciones precisas sobre partidos de la{' '}
                <span className="font-semibold">NBA</span>,{' '}
                <span className="font-semibold">NFL</span> y{' '}
                <span className="font-semibold">MLB</span>. No necesitas pagar: con solo registrarte
                accedes a análisis confiables y detallados. SPADA nació para democratizar la
                información deportiva y ayudarte a entender mejor cada juego.
            </>
        ),
        imageAlt: 'Vista de la plataforma SPADA',
    },
    en: {
        eyebrow: 'What is SPADA?',
        title: 'Advanced Sports Prediction & Analytics System',
        body: (
            <>
                SPADA is an intelligent platform that analyzes thousands of data points in real time
                to deliver accurate predictions for <span className="font-semibold">NBA</span>,{' '}
                <span className="font-semibold">NFL</span>, and{' '}
                <span className="font-semibold">MLB</span> games. You don’t need to pay—just
                register to access trustworthy, in-depth analysis. SPADA was built to democratize
                sports information and help you understand every game better.
            </>
        ),
        imageAlt: 'SPADA platform preview',
    },
    zh: {
        eyebrow: '什么是 SPADA?',
        title: '高级体育预测与分析系统',
        body: (
            <>
                SPADA 是一款智能平台，实时分析海量数据，为{' '}
                <span className="font-semibold">NBA</span>、{' '}
                <span className="font-semibold">NFL</span> 和{' '}
                <span className="font-semibold">MLB</span> 比赛提供精准预测。无需付费，
                只需注册即可获得可靠而详尽的分析。SPADA 致力于让体育数据更普惠，
                帮助你更好地理解每一场比赛。
            </>
        ),
        imageAlt: 'SPADA 平台预览',
    },
};

type AboutProps = {
    className?: string;
};

export default function About({ className = '' }: AboutProps): JSX.Element {
    const { lang } = useLanguage();
    const t = i18n[lang];

    return (
        <section
            className={`bg-[#1a1d21] text-white overflow-hidden ${className}`}
            aria-labelledby="about-title"
        >
            <div className="mx-auto max-w-7xl px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 md:py-24">
                    {/* Lado izquierdo: texto */}
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                            {t.eyebrow}
                        </p>

                        <h1
                            id="about-title"
                            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
                        >
                            {t.title}
                        </h1>

                        <p className="mt-5 text-base sm:text-lg text-white/80">{t.body}</p>
                    </div>

                    {/* Lado derecho: imagen */}
                    <div className="relative">
                        <img
                            src={imageSrc}
                            alt={t.imageAlt}
                            loading="lazy"
                            className="w-full ml-auto -mr-50 rounded-2xl ring-1 ring-white/10 shadow-2xl translate-y-1 md:translate-y-2 scale-125 md:scale-150 md:translate-x-10"
                        />
                        {/* Sombra base suave */}
                        <div className="pointer-events-none absolute -bottom-6 right-6 left-6 h-8 rounded-full blur-2xl opacity-40 bg-black" />
                    </div>
                </div>
            </div>
        </section>
    );
}
