import { useUiPreferences } from '@/contexts/ui-preferences';

type Dictionary = Record<string, { es: string; en: string }>;

const dictionary: Dictionary = {
  'brand.dashboardLogin': { es: 'Dashboard Login', en: 'Dashboard Login' },
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.skills': { es: 'Habilidades', en: 'Skills' },
  'nav.experience': { es: 'Experiencia', en: 'Experience' },
  'nav.projects': { es: 'Proyectos', en: 'Projects' },
  'nav.certificates': { es: 'Certificados', en: 'Certificates' },
  'nav.education': { es: 'Educacion', en: 'Education' },
  'nav.contact': { es: 'Contacto', en: 'Contact' },

  'layout.executivePanel': { es: 'Panel Ejecutivo', en: 'Executive Panel' },
  'layout.businessDashboard': { es: 'Business Dashboard', en: 'Business Dashboard' },
  'layout.guest': { es: 'Invitado', en: 'Guest' },
  'layout.publicView': { es: 'Vista publica del dashboard', en: 'Public dashboard view' },
  'layout.logout': { es: 'Cerrar sesion', en: 'Sign out' },
  'layout.backHome': { es: 'Volver a inicio', en: 'Back to home' },

  'auth.professionalAccess': { es: 'Acceso profesional', en: 'Professional access' },
  'auth.login': { es: 'Iniciar sesion', en: 'Sign in' },
  'auth.register': { es: 'Registrarse', en: 'Register' },
  'auth.loginToDashboard': { es: 'Ingresar al dashboard', en: 'Enter dashboard' },
  'auth.noSessionPublic': { es: 'No quiero iniciar sesion (ver datos publicos)', en: 'I do not want to sign in (view public data)' },

  'dashboard.publicTitle': { es: 'Dashboard publico de rendimiento de la pagina', en: 'Public page performance dashboard' },
  'dashboard.privateTitle': { es: 'este es tu radar de negocio', en: 'this is your business radar' },
  'dashboard.recommendations': { es: 'Recomendaciones con IA', en: 'AI recommendations' },
  'dashboard.conclusion': { es: 'Conclusion automatica', en: 'Automatic conclusion' },
  'dashboard.loadingData': { es: 'Cargando datos reales del backend...', en: 'Loading real backend data...' },
  'dashboard.retry': { es: 'Reintentar', en: 'Retry' },

  'portfolio.loadingTitle': { es: 'Inicializando escena', en: 'Initializing scene' },
  'portfolio.loadingSubtitle': { es: 'Cargando videos y recursos visuales', en: 'Loading videos and visual assets' },
  'portfolio.footerBuilt': { es: 'Hecho con React + NestJS + Neon', en: 'Built with React + NestJS + Neon' },

  'auth.email': { es: 'Email', en: 'Email' },
  'auth.password': { es: 'Contrasena', en: 'Password' },
  'auth.fullName': { es: 'Nombre completo', en: 'Full name' },
  'auth.confirmPassword': { es: 'Confirmar contrasena', en: 'Confirm password' },
  'auth.invalidCredentials': { es: 'Credenciales invalidas', en: 'Invalid credentials' },
  'auth.registerFailed': { es: 'No se pudo crear la cuenta. El email puede estar en uso.', en: 'Could not create the account. The email may already be in use.' },
  'auth.signingIn': { es: 'Ingresando...', en: 'Signing in...' },
  'auth.creatingAccount': { es: 'Creando cuenta...', en: 'Creating account...' },
  'auth.createAccount': { es: 'Crear cuenta', en: 'Create account' },
  'auth.invalidEmail': { es: 'Email invalido', en: 'Invalid email' },
  'auth.min8Chars': { es: 'Minimo 8 caracteres', en: 'Minimum 8 characters' },
  'auth.min2Chars': { es: 'Minimo 2 caracteres', en: 'Minimum 2 characters' },
  'auth.passwordsNoMatch': { es: 'Las contrasenas no coinciden', en: 'Passwords do not match' },

  'dashboard.publicDescription': { es: 'Mira indicadores en tiempo real sin iniciar sesion. Si quieres gestion completa, puedes registrarte luego.', en: 'See real-time indicators without signing in. If you want full management, you can register later.' },
  'dashboard.privateDescription': { es: 'Monitorea conversion, uso de IA y adopcion del panel en una sola vista optimizada para desktop y celular.', en: 'Monitor conversion, AI usage and dashboard adoption in one view optimized for desktop and mobile.' },
  'dashboard.noDataYet': { es: 'Aun no hay eventos registrados en analytics. El panel se llenara automaticamente cuando haya visitas y uso del chat.', en: 'There are no analytics events yet. The panel will fill automatically as visits and chat usage happen.' },
  'dashboard.trendTitle': { es: 'Tendencia de 7 dias', en: '7-day trend' },
  'dashboard.trendSubtitle': { es: 'Visitas vs uso IA', en: 'Visits vs AI usage' },
  'dashboard.funnelTitle': { es: 'Estado del embudo', en: 'Funnel status' },
  'dashboard.funnelSubtitle': { es: 'Indicadores de salud', en: 'Health indicators' },
  'dashboard.conversion': { es: 'Conversion', en: 'Conversion' },
  'dashboard.dashboardAdoption': { es: 'Adopcion dashboard', en: 'Dashboard adoption' },
  'dashboard.aiIntensity': { es: 'Intensidad IA por visita', en: 'AI intensity per visit' },
  'dashboard.peakDay': { es: 'Dia pico semanal', en: 'Weekly peak day' },
  'dashboard.activityDistribution': { es: 'Distribucion de actividad', en: 'Activity distribution' },
  'dashboard.visits': { es: 'Visitas', en: 'Visits' },
  'dashboard.aiUsage': { es: 'Uso IA', en: 'AI usage' },
  'dashboard.loginClicks': { es: 'Clicks Dashboard Login', en: 'Dashboard Login clicks' },
  'dashboard.dashboardViews': { es: 'Vistas de Dashboard', en: 'Dashboard views' },
  'dashboard.kpiVisits': { es: 'Visitas al portafolio', en: 'Portfolio visits' },
  'dashboard.kpiVisitsHelp': { es: 'Interes total por la pagina', en: 'Total interest in the page' },
  'dashboard.kpiAi': { es: 'Uso del chat IA', en: 'AI chat usage' },
  'dashboard.kpiAiHelp': { es: 'Consultas enviadas al asistente', en: 'Queries sent to the assistant' },
  'dashboard.kpiUsers': { es: 'Usuarios registrados', en: 'Registered users' },
  'dashboard.kpiUsersHelp': { es: 'Leido desde la base de datos', en: 'Read from the database' },
  'dashboard.kpiConversion': { es: 'Conversion de visitas', en: 'Visit conversion' },
  'dashboard.kpiConversionHelp': { es: 'Usuarios registrados / visitas', en: 'Registered users / visits' },
  'dashboard.aiSuggestionsHelp': { es: 'Sugerencias accionables basadas en tus metricas actuales', en: 'Actionable suggestions based on your current metrics' },
  'dashboard.aiGenerating': { es: 'La IA esta generando recomendaciones...', en: 'AI is generating recommendations...' },
  'dashboard.aiError': { es: 'No se pudieron generar recomendaciones con IA en este momento.', en: 'AI recommendations could not be generated right now.' },
  'dashboard.aiEmpty': { es: 'Aun no hay recomendaciones disponibles.', en: 'No recommendations available yet.' },
  'dashboard.ready': { es: 'Datos listos para analisis y decisiones.', en: 'Data is ready for analysis and decisions.' },
  'dashboard.loadingSummary': { es: 'Cargando resumen real desde API...', en: 'Loading real summary from API...' },
  'dashboard.publicError': { es: 'No se pudo cargar el dashboard publico. Revisa el backend e intenta de nuevo.', en: 'Public dashboard could not be loaded. Check the backend and try again.' },
  'dashboard.privateError': { es: 'No se pudo cargar el dashboard real. Revisa backend o token e intenta de nuevo.', en: 'Real dashboard could not be loaded. Check backend or token and try again.' },

  'global.toggleLanguage': { es: 'Cambiar idioma', en: 'Toggle language' },
  'global.toggleTheme': { es: 'Cambiar tema', en: 'Toggle theme' },
  'global.themeLight': { es: 'Claro', en: 'Light' },
  'global.themeDark': { es: 'Oscuro', en: 'Dark' },

  'layout.openMenu': { es: 'Abrir menu', en: 'Open menu' },
  'portfolio.backToTop': { es: 'Volver al inicio', en: 'Back to top' },
};

export function useI18n() {
  const { language } = useUiPreferences();

  const t = (key: string, fallback?: string) => {
    const entry = dictionary[key];
    if (!entry) return fallback ?? key;
    return entry[language];
  };

  return { t, language };
}
