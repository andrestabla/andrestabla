export const SUPPORTED_LOCALES = ['es', 'en', 'fr'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';
export const LOCALE_STORAGE_KEY = 'atr-locale';
export const LOCALE_COOKIE_KEY = 'atr-locale';

export function isSupportedLocale(value: string | null | undefined): value is Locale {
    return SUPPORTED_LOCALES.includes((value || '').toLowerCase() as Locale);
}

export function resolveLocale(value: string | null | undefined): Locale {
    const normalized = (value || '').toLowerCase();
    return isSupportedLocale(normalized) ? normalized : DEFAULT_LOCALE;
}

export type MessageKey =
    | 'language.label'
    | 'language.es'
    | 'language.en'
    | 'language.fr'
    | 'nav.openMenu'
    | 'nav.closeMenu'
    | 'nav.default.home'
    | 'nav.default.experience'
    | 'nav.default.education'
    | 'nav.default.courses'
    | 'assistant.openButton'
    | 'assistant.panelTitle'
    | 'assistant.panelPowered'
    | 'assistant.closeButton'
    | 'assistant.initialMessage'
    | 'assistant.quickWho'
    | 'assistant.quickExperience'
    | 'assistant.quickContact'
    | 'assistant.typing'
    | 'assistant.inputPlaceholder'
    | 'assistant.sendButton'
    | 'assistant.ctaHint'
    | 'assistant.errorGeneric'
    | 'assistant.errorConnection'
    | 'policy.badge'
    | 'policy.title'
    | 'policy.versionLabel'
    | 'policy.intro'
    | 'policy.readPolicy'
    | 'policy.continueWithoutAnalytics'
    | 'policy.acceptAndContinue'
    | 'policy.close'
    | 'policy.dataRegisteredTitle'
    | 'policy.purposeTitle'
    | 'policy.dataItem1'
    | 'policy.dataItem2'
    | 'policy.dataItem3'
    | 'policy.dataItem4'
    | 'policy.purposeItem1'
    | 'policy.purposeItem2'
    | 'policy.purposeItem3'
    | 'policy.purposeItem4'
    | 'policy.section1Title'
    | 'policy.section1Body'
    | 'policy.section2Title'
    | 'policy.section2Body'
    | 'policy.section3Title'
    | 'policy.section3Body'
    | 'policy.section4Title'
    | 'policy.section4Body'
    | 'policy.section5Title'
    | 'policy.section5Body'
    | 'policy.preview'
    | 'loopgrid.latestArticles'
    | 'loopgrid.latestProjects'
    | 'loopgrid.viewAll'
    | 'loopgrid.readMore'
    | 'loopgrid.general'
    | 'loopgrid.untitled'
    | 'loopgrid.noDescription'
    | 'navmenu.menuTitle'
    | 'navmenu.default.home'
    | 'navmenu.default.services'
    | 'navmenu.default.portfolio'
    | 'navmenu.default.about'
    | 'navmenu.default.contact'
    | 'assistantApi.contactHint'
    | 'assistantApi.ctaHint'
    | 'assistantApi.actionEmail'
    | 'assistantApi.actionBooking'
    | 'assistantApi.actionWhatsapp'
    | 'assistantApi.ageSentence';

export type MessageParams = Record<string, string | number>;

type Messages = Record<MessageKey, string>;

const es: Messages = {
    'language.label': 'Idioma',
    'language.es': 'Español',
    'language.en': 'Inglés',
    'language.fr': 'Francés',
    'nav.openMenu': 'Abrir menú',
    'nav.closeMenu': 'Cerrar menú',
    'nav.default.home': 'Inicio',
    'nav.default.experience': 'Experiencia',
    'nav.default.education': 'Educación',
    'nav.default.courses': 'Cursos',
    'assistant.openButton': 'Asistente',
    'assistant.panelTitle': 'Asistente de Andrés',
    'assistant.panelPowered': 'Powered by OpenAI',
    'assistant.closeButton': 'Cerrar asistente',
    'assistant.initialMessage':
        'Hola, soy el asistente de Andrés Tabla. Puedo contarte sobre su perfil, experiencia, formación y proyectos. ¿Qué te gustaría conocer?',
    'assistant.quickWho': '¿Quién es Andrés Tabla?',
    'assistant.quickExperience': '¿Cuál es su experiencia?',
    'assistant.quickContact': '¿Cómo puedo contactarlo?',
    'assistant.typing': 'Escribiendo...',
    'assistant.inputPlaceholder': 'Escribe tu pregunta...',
    'assistant.sendButton': 'Enviar mensaje',
    'assistant.ctaHint': 'Usa los botones CTA de abajo para contactar a Andrés.',
    'assistant.errorGeneric': 'No fue posible responder ahora.',
    'assistant.errorConnection': 'Error de conexión.',
    'policy.badge': 'Política y Consentimiento',
    'policy.title': 'Política de tratamiento de datos',
    'policy.versionLabel': 'Versión',
    'policy.intro':
        'Usamos cookies y analítica de navegación para mejorar la experiencia, medir interacción y optimizar el contenido del sitio. Puedes consultar el detalle de tratamiento y aceptar para continuar con analítica.',
    'policy.readPolicy': 'Leer política',
    'policy.continueWithoutAnalytics': 'Continuar sin analítica',
    'policy.acceptAndContinue': 'Aceptar y continuar',
    'policy.close': 'Cerrar',
    'policy.dataRegisteredTitle': 'Datos que podemos registrar',
    'policy.purposeTitle': 'Finalidad del tratamiento',
    'policy.dataItem1': 'Ubicación geográfica aproximada por IP (país, región, ciudad).',
    'policy.dataItem2': 'Páginas y secciones consultadas en el sitio.',
    'policy.dataItem3': 'Tiempo de permanencia estimado por página.',
    'policy.dataItem4': 'Eventos de interacción técnica para analítica operativa.',
    'policy.purposeItem1': 'Mejorar experiencia de navegación y usabilidad.',
    'policy.purposeItem2': 'Medir interacción con páginas y secciones.',
    'policy.purposeItem3': 'Optimizar contenido y rendimiento del sitio.',
    'policy.purposeItem4': 'Generar trazabilidad de aceptación del consentimiento.',
    'policy.section1Title': '1. Alcance y consentimiento',
    'policy.section1Body':
        'El tratamiento descrito en esta política aplica a datos técnicos y de navegación recolectados en este sitio una vez otorgado el consentimiento. Puedes continuar sin analítica; en ese caso, no se registran eventos de navegación para fines analíticos.',
    'policy.section2Title': '2. Datos tratados',
    'policy.section2Body':
        'No hay lista de datos configurada aún en el CMS. Puedes completarla en Admin > Configuración.',
    'policy.section3Title': '3. Conservación y uso de la información',
    'policy.section3Body':
        'Los datos de consentimiento y navegación se almacenan en infraestructura de servidor y base de datos asociada al sitio para analítica, operación y trazabilidad. Se utilizan de forma agregada y operativa, y no para decisiones automatizadas sobre el usuario final.',
    'policy.section4Title': '4. Derechos del usuario',
    'policy.section4Body':
        'Puedes negarte al uso de analítica mediante la opción “Continuar sin analítica”. También puedes revocar el consentimiento limpiando los datos locales del navegador (cookies/localStorage/sessionStorage) y dejando de usar el sitio.',
    'policy.section5Title': '5. Texto administrado en CMS',
    'policy.section5Body':
        'Tratamos datos de navegación con fines de analítica, mejora continua, seguridad y optimización de la experiencia digital. Esto puede incluir ubicación geográfica aproximada por IP, páginas y secciones visitadas y tiempo de permanencia estimado por página, una vez otorgado el consentimiento.',
    'policy.preview': 'Vista previa',
    'loopgrid.latestArticles': 'Últimos Artículos',
    'loopgrid.latestProjects': 'Últimos Proyectos',
    'loopgrid.viewAll': 'Ver Todos',
    'loopgrid.readMore': 'Leer más',
    'loopgrid.general': 'General',
    'loopgrid.untitled': 'Sin título',
    'loopgrid.noDescription': 'Sin descripción',
    'navmenu.menuTitle': 'Menú',
    'navmenu.default.home': 'Inicio',
    'navmenu.default.services': 'Servicios',
    'navmenu.default.portfolio': 'Portafolio',
    'navmenu.default.about': 'Acerca',
    'navmenu.default.contact': 'Contacto',
    'assistantApi.contactHint': 'Para contactarte con Andrés Tabla, usa uno de estos botones: Correo, Agendar reunión o WhatsApp.',
    'assistantApi.ctaHint': 'Usa los botones CTA de abajo para contactar a Andrés.',
    'assistantApi.actionEmail': 'Correo',
    'assistantApi.actionBooking': 'Agendar reunión',
    'assistantApi.actionWhatsapp': 'WhatsApp',
    'assistantApi.ageSentence': 'Andrés tiene {{age}} años.',
};

const en: Messages = {
    'language.label': 'Language',
    'language.es': 'Spanish',
    'language.en': 'English',
    'language.fr': 'French',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.default.home': 'Home',
    'nav.default.experience': 'Experience',
    'nav.default.education': 'Education',
    'nav.default.courses': 'Courses',
    'assistant.openButton': 'Assistant',
    'assistant.panelTitle': "Andrés's Assistant",
    'assistant.panelPowered': 'Powered by OpenAI',
    'assistant.closeButton': 'Close assistant',
    'assistant.initialMessage':
        "Hi, I'm Andrés Tabla's assistant. I can tell you about his profile, experience, education, and projects. What would you like to know?",
    'assistant.quickWho': 'Who is Andrés Tabla?',
    'assistant.quickExperience': 'What is his experience?',
    'assistant.quickContact': 'How can I contact him?',
    'assistant.typing': 'Typing...',
    'assistant.inputPlaceholder': 'Type your question...',
    'assistant.sendButton': 'Send message',
    'assistant.ctaHint': 'Use the CTA buttons below to contact Andrés.',
    'assistant.errorGeneric': 'Unable to answer right now.',
    'assistant.errorConnection': 'Connection error.',
    'policy.badge': 'Policy and Consent',
    'policy.title': 'Data processing policy',
    'policy.versionLabel': 'Version',
    'policy.intro':
        'We use cookies and navigation analytics to improve user experience, measure interactions, and optimize website content. You can review the policy details and accept to enable analytics.',
    'policy.readPolicy': 'Read policy',
    'policy.continueWithoutAnalytics': 'Continue without analytics',
    'policy.acceptAndContinue': 'Accept and continue',
    'policy.close': 'Close',
    'policy.dataRegisteredTitle': 'Data we may collect',
    'policy.purposeTitle': 'Purpose of processing',
    'policy.dataItem1': 'Approximate geographic location by IP (country, region, city).',
    'policy.dataItem2': 'Pages and sections visited on the website.',
    'policy.dataItem3': 'Estimated time spent per page.',
    'policy.dataItem4': 'Technical interaction events for operational analytics.',
    'policy.purposeItem1': 'Improve browsing experience and usability.',
    'policy.purposeItem2': 'Measure interactions with pages and sections.',
    'policy.purposeItem3': 'Optimize content and website performance.',
    'policy.purposeItem4': 'Generate consent acceptance traceability.',
    'policy.section1Title': '1. Scope and consent',
    'policy.section1Body':
        'The processing described in this policy applies to technical and browsing data collected on this site once consent is granted. You may continue without analytics; in that case, browsing events are not recorded for analytics purposes.',
    'policy.section2Title': '2. Processed data',
    'policy.section2Body':
        'No specific data list is configured in the CMS yet. You can complete it in Admin > Settings.',
    'policy.section3Title': '3. Data retention and use',
    'policy.section3Body':
        'Consent and browsing data are stored in server and database infrastructure associated with the website for analytics, operations, and traceability. They are used in aggregate and operational ways, not for automated decisions about end users.',
    'policy.section4Title': '4. User rights',
    'policy.section4Body':
        'You may decline analytics by selecting “Continue without analytics”. You can also revoke consent by clearing local browser data (cookies/localStorage/sessionStorage) and stopping use of the website.',
    'policy.section5Title': '5. CMS-managed text',
    'policy.section5Body':
        'We process browsing data for analytics, continuous improvement, security, and optimization of digital experience. This may include approximate geographic location by IP, pages and sections visited, and estimated page time, once consent is granted.',
    'policy.preview': 'Preview',
    'loopgrid.latestArticles': 'Latest Articles',
    'loopgrid.latestProjects': 'Latest Projects',
    'loopgrid.viewAll': 'View All',
    'loopgrid.readMore': 'Read more',
    'loopgrid.general': 'General',
    'loopgrid.untitled': 'Untitled',
    'loopgrid.noDescription': 'No description',
    'navmenu.menuTitle': 'Menu',
    'navmenu.default.home': 'Home',
    'navmenu.default.services': 'Services',
    'navmenu.default.portfolio': 'Portfolio',
    'navmenu.default.about': 'About',
    'navmenu.default.contact': 'Contact',
    'assistantApi.contactHint': 'To contact Andrés Tabla, use one of these buttons: Email, Schedule meeting, or WhatsApp.',
    'assistantApi.ctaHint': 'Use the CTA buttons below to contact Andrés.',
    'assistantApi.actionEmail': 'Email',
    'assistantApi.actionBooking': 'Schedule meeting',
    'assistantApi.actionWhatsapp': 'WhatsApp',
    'assistantApi.ageSentence': 'Andrés is {{age}} years old.',
};

const fr: Messages = {
    'language.label': 'Langue',
    'language.es': 'Espagnol',
    'language.en': 'Anglais',
    'language.fr': 'Français',
    'nav.openMenu': 'Ouvrir le menu',
    'nav.closeMenu': 'Fermer le menu',
    'nav.default.home': 'Accueil',
    'nav.default.experience': 'Expérience',
    'nav.default.education': 'Éducation',
    'nav.default.courses': 'Cours',
    'assistant.openButton': 'Assistant',
    'assistant.panelTitle': "Assistant d'Andrés",
    'assistant.panelPowered': 'Powered by OpenAI',
    'assistant.closeButton': "Fermer l'assistant",
    'assistant.initialMessage':
        "Bonjour, je suis l'assistant d'Andrés Tabla. Je peux vous parler de son profil, de son expérience, de sa formation et de ses projets. Que souhaitez-vous savoir ?",
    'assistant.quickWho': 'Qui est Andrés Tabla ?',
    'assistant.quickExperience': 'Quelle est son expérience ?',
    'assistant.quickContact': 'Comment puis-je le contacter ?',
    'assistant.typing': 'Rédaction...',
    'assistant.inputPlaceholder': 'Écrivez votre question...',
    'assistant.sendButton': 'Envoyer le message',
    'assistant.ctaHint': 'Utilisez les boutons CTA ci-dessous pour contacter Andrés.',
    'assistant.errorGeneric': "Impossible de répondre pour l'instant.",
    'assistant.errorConnection': 'Erreur de connexion.',
    'policy.badge': 'Politique et consentement',
    'policy.title': 'Politique de traitement des données',
    'policy.versionLabel': 'Version',
    'policy.intro':
        "Nous utilisons des cookies et des analyses de navigation pour améliorer l'expérience, mesurer les interactions et optimiser le contenu du site. Vous pouvez consulter le détail du traitement et accepter pour activer l'analytique.",
    'policy.readPolicy': 'Lire la politique',
    'policy.continueWithoutAnalytics': 'Continuer sans analytique',
    'policy.acceptAndContinue': 'Accepter et continuer',
    'policy.close': 'Fermer',
    'policy.dataRegisteredTitle': 'Données que nous pouvons enregistrer',
    'policy.purposeTitle': 'Finalité du traitement',
    'policy.dataItem1': 'Localisation géographique approximative par IP (pays, région, ville).',
    'policy.dataItem2': 'Pages et sections consultées sur le site.',
    'policy.dataItem3': 'Temps de présence estimé par page.',
    'policy.dataItem4': "Événements d'interaction technique pour l'analytique opérationnelle.",
    'policy.purposeItem1': "Améliorer l'expérience de navigation et l'utilisabilité.",
    'policy.purposeItem2': 'Mesurer les interactions avec les pages et sections.',
    'policy.purposeItem3': 'Optimiser le contenu et les performances du site.',
    'policy.purposeItem4': "Générer une traçabilité de l'acceptation du consentement.",
    'policy.section1Title': '1. Portée et consentement',
    'policy.section1Body':
        "Le traitement décrit dans cette politique s'applique aux données techniques et de navigation collectées sur ce site une fois le consentement accordé. Vous pouvez continuer sans analytique ; dans ce cas, les événements de navigation ne sont pas enregistrés à des fins analytiques.",
    'policy.section2Title': '2. Données traitées',
    'policy.section2Body':
        "Aucune liste de données n'est encore configurée dans le CMS. Vous pouvez la compléter dans Admin > Configuration.",
    'policy.section3Title': '3. Conservation et utilisation des informations',
    'policy.section3Body':
        "Les données de consentement et de navigation sont stockées dans l'infrastructure serveur et la base de données associées au site pour l'analytique, l'exploitation et la traçabilité. Elles sont utilisées de manière agrégée et opérationnelle, et non pour des décisions automatisées concernant l'utilisateur final.",
    'policy.section4Title': "4. Droits de l'utilisateur",
    'policy.section4Body':
        "Vous pouvez refuser l'analytique avec l'option « Continuer sans analytique ». Vous pouvez également révoquer votre consentement en supprimant les données locales du navigateur (cookies/localStorage/sessionStorage) et en cessant d'utiliser le site.",
    'policy.section5Title': '5. Texte administré dans le CMS',
    'policy.section5Body':
        "Nous traitons des données de navigation à des fins d'analytique, d'amélioration continue, de sécurité et d'optimisation de l'expérience numérique. Cela peut inclure la localisation géographique approximative par IP, les pages et sections visitées et le temps estimé passé par page, une fois le consentement accordé.",
    'policy.preview': 'Aperçu',
    'loopgrid.latestArticles': 'Derniers articles',
    'loopgrid.latestProjects': 'Derniers projets',
    'loopgrid.viewAll': 'Voir tout',
    'loopgrid.readMore': 'Lire plus',
    'loopgrid.general': 'Général',
    'loopgrid.untitled': 'Sans titre',
    'loopgrid.noDescription': 'Sans description',
    'navmenu.menuTitle': 'Menu',
    'navmenu.default.home': 'Accueil',
    'navmenu.default.services': 'Services',
    'navmenu.default.portfolio': 'Portfolio',
    'navmenu.default.about': 'À propos',
    'navmenu.default.contact': 'Contact',
    'assistantApi.contactHint': "Pour contacter Andrés Tabla, utilisez l'un de ces boutons : E-mail, Planifier une réunion ou WhatsApp.",
    'assistantApi.ctaHint': 'Utilisez les boutons CTA ci-dessous pour contacter Andrés.',
    'assistantApi.actionEmail': 'E-mail',
    'assistantApi.actionBooking': 'Planifier une réunion',
    'assistantApi.actionWhatsapp': 'WhatsApp',
    'assistantApi.ageSentence': 'Andrés a {{age}} ans.',
};

export const I18N_MESSAGES: Record<Locale, Messages> = { es, en, fr };

function interpolate(template: string, params?: MessageParams) {
    if (!params) return template;
    return Object.entries(params).reduce((output, [key, value]) => {
        return output.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(value));
    }, template);
}

export function t(locale: Locale, key: MessageKey, params?: MessageParams): string {
    const value = I18N_MESSAGES[locale]?.[key] || I18N_MESSAGES[DEFAULT_LOCALE][key] || key;
    return interpolate(value, params);
}
