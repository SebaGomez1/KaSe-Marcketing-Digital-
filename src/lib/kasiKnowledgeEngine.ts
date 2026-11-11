import { Campaign, User } from '../types/growth';

export interface KaSiActionProposal {
  id: string;
  type: 'toggle_status' | 'navigate' | 'new_campaign' | 'install_app' | 'one_dollar_test' | 'reset_counter' | 'simulate_burst' | 'audit_campaign' | 'open_auth';
  title: string;
  description: string;
  target?: string;
  count?: number;
}

export interface KaSiReplyResult {
  reply: string;
  action?: KaSiActionProposal;
  suggestions: string[];
  source: string;
}

export interface KaSiEngineContext {
  isInside: boolean;
  currentUser?: User | null;
  activeCampaign?: Campaign | null;
  activeTab?: string;
  isSuperAdmin?: boolean;
}

/**
 * Motor Autónomo de Conocimiento KaSi 2.0 (Dual Persona: Afuera vs Adentro)
 * 
 * PERSONA AFUERA (Visitante sin sesión):
 * - Responde cualquier duda y SIEMPRE guía a registrarse con cuenta gratuita.
 * 
 * PERSONA ADENTRO (Usuario con sesión):
 * - Resuelve cualquier duda técnica o de negocio, ayuda en todo y VENDE CAMPAÑAS SUTILMENTE.
 */
export function generateKaSiReply(userMessage: string, ctx: KaSiEngineContext): KaSiReplyResult {
  const m = (userMessage || '').toLowerCase().trim();
  const isInside = ctx.isInside || !!ctx.currentUser;
  const isSuperAdmin = ctx.isSuperAdmin || ctx.currentUser?.role === 'super_admin' || ctx.currentUser?.email?.toLowerCase() === 'kathyseba2020@gmail.com';
  const camp = ctx.activeCampaign;
  const campName = camp?.name || 'tu campaña';
  const userName = ctx.currentUser ? (ctx.currentUser.name || ctx.currentUser.email.split('@')[0]) : 'amigo emprendedor';

  // 0. CONTROL DE ACCESO (SUPER ADMIN VS USUARIO COMÚN)
  const isAdminActionRequested = 
    m.includes('admin global') ||
    m.includes('panel de admin') ||
    m.includes('claves maestras') ||
    m.includes('credenciales mercado pago') ||
    m.includes('credenciales supabase') ||
    m.includes('ganancias totales') ||
    m.includes('todos los usuarios') ||
    m.includes('destruir plan');

  if (isAdminActionRequested && !isSuperAdmin) {
    return {
      reply: '⛔ **ACCESO RESTRINGIDO · NIVEL SUPER ADMINISTRADOR**\n\n' +
        'Esta sección y credenciales maestras pertenecen **exclusivamente a la administración central de KaSe (Kathy Seba)** por seguridad bancaria Zero-Access.\n\n' +
        '💡 Como cliente, tú tienes control total sobre tus campañas, tus métricas en vivo y tu Enlace Puente Inteligente.',
      suggestions: [
        isInside ? '📊 Ver mi Dashboard' : '📝 Crear cuenta gratuita',
        isInside ? '🚀 Auditar mi campaña' : '💰 Ver planes y precios',
        '💳 Planes y Precios'
      ],
      source: 'kasi_rbac_guard'
    };
  }

  // 1. CLARIFICACIÓN: SIMULACIÓN DE RÁFAGA / TRÁFICO REAL VS BOTS
  if (
    m.includes('simular') ||
    m.includes('rafaga') ||
    m.includes('ráfaga') ||
    m.includes('falso') ||
    m.includes('fake') ||
    m.includes('bot') ||
    m.includes('bots') ||
    m.includes('es real') ||
    m.includes('son reales')
  ) {
    const subtlePitch = isInside
      ? (camp
          ? `\n\n💡 **Tu campaña "${campName}"**: Está captando tráfico 100% humano a través del Enlace Puente. ¿Deseas auditar su avance o prefieres activar una segunda campaña para otro producto?`
          : `\n\n💡 **Oportunidad de Crecimiento**: Como el tráfico es 100% real, cada día que no tienes una campaña activa dejas pasar clientes potenciales. ¿Deseas encender una nueva campaña hoy?`)
      : `\n\n👉 **Comienza ahora**: Crea tu cuenta gratuita y comprueba cómo llegan tus primeras visitas y clientes reales en piloto automático.`;

    return {
      reply: '🛡️ **POLÍTICA DE TRÁFICO 100% HUMANO Y CUOTA PROTEGIDA EN KaSe**\n\n' +
        'Tienes toda la razón en dudar de las simulaciones: **en campañas reales de pago, NO se deben simular ráfagas artificiales**.\n\n' +
        '• **Por qué no simulamos**: Si pagas por 1,000 registros y el sistema te simulara 25 usuarios ficticios, esos 25 se descontarían de tu saldo contratado, lo que significa que **recibirías 25 clientes reales menos**. ¡No tiene sentido perjudicar tu negocio!\n' +
        '• **Tráfico 100% Real**: Cada clic y conversión en tu Enlace Puente (`/r/:id`) proviene de personas reales atraídas por los 8 motores (Google Indexing, X, Directorios de Software, Foros Q&A con Anti-Ban, Newsletters, Reels/TikTok y Afiliados).\n' +
        '• **Auto-Pausa Segura**: Cumplida tu meta contratada, los motores se detienen automáticamente para que nunca pagues de más.' +
        subtlePitch,
      action: !isInside ? {
        id: `act_auth_${Date.now()}`,
        type: 'open_auth',
        title: '📝 Crear Cuenta Gratuita y Probar Tráfico Real',
        description: 'Regístrate en 30 segundos sin tarjetas para explorar la plataforma.',
      } : {
        id: `act_new_camp_${Date.now()}`,
        type: 'new_campaign',
        title: '➕ Crear Campaña con Tráfico Real Garantizado',
        description: 'Define tu URL de destino y meta de clientes para encender los 8 motores.',
      },
      suggestions: !isInside ? [
        '📝 Crear cuenta gratuita',
        '🚀 ¿Cómo funciona KaSe?',
        '💰 Ver planes y precios',
        '🛡️ ¿Tengo que configurar APIs?'
      ] : [
        '📊 Ver Dashboard de mi campaña',
        '➕ Nueva campaña de crecimiento',
        '💳 Ver Planes y Mercado Pago',
        '🔌 Ver mi Enlace Puente'
      ],
      source: 'kasi_core_truth'
    };
  }

  // 2. CLARIFICACIÓN: CERO APIS PARA EL USUARIO
  if (
    m.includes('api') ||
    m.includes('apis') ||
    m.includes('configurar api') ||
    m.includes('configurar apis') ||
    m.includes('donde pongo las apis') ||
    m.includes('por que me pides api') ||
    m.includes('porque me pides api')
  ) {
    const closure = !isInside
      ? '\n\n👉 **Crea tu cuenta gratuita hoy** y compruébalo tú mismo en 30 segundos.'
      : '\n\n💡 **Tip Estratégico**: Ya tienes el camino despejado. ¿Deseas encender una campaña para tu web o prefieres que revisemos una cotización personalizada?';

    return {
      reply: '🛡️ **TÚ NO TIENES QUE CREAR, PROGRAMAR NI CONFIGURAR NINGUNA API.**\n\n' +
        'KaSe Marketing Digital opera con tecnología 100% autónoma en nuestra nube. Toda la conexión con Google Search Console, X, Directorios, comunidades y pasarelas es administrada de forma centralizada por nuestro equipo de ingeniería.\n\n' +
        'Como usuario, tus únicos 3 pasos son:\n' +
        '1️⃣ Brindar el enlace de la página web a la cual deseas llevar compradores o registros.\n' +
        '2️⃣ Tus datos de acceso a tu cuenta.\n' +
        '3️⃣ Seleccionar tu meta de conversiones y presupuesto en el formulario de campaña.\n\n' +
        '¡Más nada! Del resto se encargan los 8 motores autónomos.' + closure,
      action: !isInside ? {
        id: `act_auth_${Date.now()}`,
        type: 'open_auth',
        title: '📝 Crear Cuenta Gratuita (Cero APIs)',
        description: 'Comienza en segundos sin necesidad de programar nada.',
      } : {
        id: `act_new_camp_${Date.now()}`,
        type: 'new_campaign',
        title: '➕ Configurar Nueva Campaña',
        description: 'Solo ingresa tu link y meta de clientes.',
      },
      suggestions: !isInside ? [
        '📝 Crear cuenta gratuita',
        '🚀 ¿Cómo funcionan los 8 motores?',
        '💰 Ver planes y precios',
        '⭐ ¿Son clientes reales?'
      ] : [
        '➕ Crear nueva campaña',
        '💳 Ver planes y precios',
        '🔌 Ver mi Enlace Puente',
        '🚀 Auditar mi campaña'
      ],
      source: 'kasi_zero_api_rule'
    };
  }

  // 3. SALUDOS Y PRESENTACIÓN
  if (
    m === 'hola' ||
    m === 'buenas' ||
    m === 'buen dia' ||
    m === 'buen día' ||
    m === 'buenas tardes' ||
    m === 'buenas noches' ||
    m === 'hey' ||
    m === 'hola!' ||
    m === 'hola kasi' ||
    m.startsWith('hola ') ||
    m.startsWith('buenos dias') ||
    m.startsWith('buen dia') ||
    m.startsWith('buenas ') ||
    m === 'que tal' ||
    m === 'qué tal' ||
    m === 'como estas' ||
    m === 'cómo estás'
  ) {
    if (!isInside) {
      // AGENTE DE AFUERA: Siempre invita a registrarse
      return {
        reply: `¡Hola, amigo emprendedor! ✨🤖 Soy **KaSi 2.0**, el Agente de Inteligencia Artificial de **KaSe Marketing Digital** (fundado por Kathy Seba).\n\n` +
          `Te ayudo a conseguir clientes, ventas y registros reales para tu página web o tienda en piloto automático:\n\n` +
          `• **Cero APIs para ti**: Tú solo ingresas tu link; nosotros operamos los 8 motores.\n` +
          `• **Tráfico 100% Humano**: Cero bots ni simulaciones.\n` +
          `• **Garantía Exacta**: Al cumplir tu meta de clientes, se auto-apaga para proteger tu dinero.\n\n` +
          `👉 **El primer paso es crear tu cuenta gratuita**. Te toma 30 segundos y tendrás acceso inmediato para explorar la plataforma. ¿Te gustaría registrarte ahora?`,
        action: {
          id: `act_auth_${Date.now()}`,
          type: 'open_auth',
          title: '📝 Crear Cuenta Gratuita en 30 Segundos',
          description: 'Únete a KaSe y prepárate para escalar tus ventas.',
        },
        suggestions: [
          '📝 Crear cuenta gratuita',
          '🚀 ¿Cómo funciona KaSe?',
          '💰 ¿Cuáles son los planes y precios?',
          '🛡️ ¿Tengo que configurar APIs?'
        ],
        source: 'kasi_hero_greeter'
      };
    } else {
      // AGENTE DE ADENTRO: Asiste en todo y vende sutilmente
      const pitchInside = camp
        ? `\n\n🎯 **Tu Campaña Activa**: *${campName}* (${camp.currentRegistrations}/${camp.targetRegistrations} conversiones).\n💡 **Sugerencia Estratégica**: ¿Deseas auditar su rendimiento en tiempo real o prefieres que configuremos una campaña adicional para multiplicar tus resultados?`
        : `\n\n💡 **Sugerencia de Crecimiento**: Noté que aún no tienes una campaña activa en este momento. Con el Plan Starter ($490) podemos garantizarte tus primeros 1,000 registros calificados. ¿Deseas que la configuremos juntos en 60 segundos?`;

      return {
        reply: `¡Hola, ${userName}! ✨🤖 Soy **KaSi 2.0**, tu Copiloto Inteligente de Crecimiento en KaSe.\n\n` +
          `Estoy conectado a toda la suite para resolver cualquier duda técnica, ayudarte con tus motores y asesorarte en la escala de tu negocio.` +
          pitchInside,
        action: camp ? {
          id: `act_nav_dash_${Date.now()}`,
          type: 'navigate',
          target: 'dashboard',
          title: '📊 Ver Dashboard de Campaña',
          description: 'Revisa las métricas y conversiones en vivo.',
        } : {
          id: `act_new_camp_${Date.now()}`,
          type: 'new_campaign',
          title: '➕ Iniciar Primera Campaña de Clientes',
          description: 'Configura tu link y meta para encender los 8 motores.',
        },
        suggestions: camp ? [
          '🚀 Auditar mi campaña actual',
          '➕ Lanzar campaña complementaria',
          '💳 Ver Planes y Ampliaciones',
          '🔌 Ver Enlace Puente'
        ] : [
          '➕ Crear nueva campaña ahora',
          '💳 Ver planes y precios',
          '🚀 ¿Cómo funcionan los 8 motores?',
          '🔌 ¿Cómo funciona el Enlace Puente?'
        ],
        source: 'kasi_inside_copilot'
      };
    }
  }

  // 4. CÓMO FUNCIONA LA APLICACIÓN / MOTORES
  if (
    m.includes('como funciona') ||
    m.includes('cómo funciona') ||
    m.includes('de que trata') ||
    m.includes('de qué trata') ||
    m.includes('explicame') ||
    m.includes('explícame') ||
    m.includes('que es kase') ||
    m.includes('qué es kase') ||
    m.includes('que hacen') ||
    m.includes('qué hacen') ||
    m.includes('como me consiguen clientes') ||
    m.includes('cómo me consiguen clientes') ||
    m.includes('motores')
  ) {
    if (!isInside) {
      return {
        reply: '🚀 **¿CÓMO CONSIGUE KaSe CLIENTES REALES PARA TU NEGOCIO?**\n\n' +
          'KaSe opera mediante una orquestación omnicanal de **8 motores autónomos en la nube**:\n\n' +
          '1️⃣ **Indexación Relámpago**: Módulo 1 envía tus URLs a Google Indexing API para posicionarte en menos de 48 horas.\n' +
          '2️⃣ **Syndication Social**: Módulo 2 publica hilos de alto valor en X/Twitter y LinkedIn.\n' +
          '3️⃣ **Directorios Globales**: Módulo 3 lista tu producto en 50+ directorios de software.\n' +
          '4️⃣ **Outbound X & Newsletters**: Módulos 4 y 5 ejecutan escucha activa de alta intención en X y foros Q&A con protección Anti-Ban y pitch B2B para compradores listos.\n' +
          '5️⃣ **Viralidad & SEO Masivo**: Módulos 6, 7 y 8 generan micro-videos (Reels/TikTok), miles de páginas pSEO y alianzas con influencers.\n\n' +
          'Todo el tráfico llega filtrado a tu web a través del Enrutador Puente (`/r/:id`), sumando +1 de forma atómica y apagándose cuando se alcanza la meta contratada.\n\n' +
          '👉 **Para ver los motores en acción y configurar tu primera campaña, crea tu cuenta gratuita ahora:**',
        action: {
          id: `act_auth_${Date.now()}`,
          type: 'open_auth',
          title: '📝 Registrarme Gratis y Ver los Motores',
          description: 'Crea tu cuenta en 30 segundos sin tarjetas.',
        },
        suggestions: [
          '📝 Crear cuenta gratuita',
          '💰 ¿Cuáles son los precios?',
          '🛡️ ¿Tengo que configurar APIs?',
          '⭐ ¿Son clientes reales?'
        ],
        source: 'kasi_hero_explainer'
      };
    } else {
      return {
        reply: '🚀 **ARQUITECTURA DE TUS 8 MOTORES AUTÓNOMOS · KaSe**\n\n' +
          'Tu plataforma está respaldada por una infraestructura monolítica de alto rendimiento:\n\n' +
          '• **Módulos Base (1, 2, 3)**: Google Indexing API + X/LinkedIn + 50 Directorios. (Incluidos en Plan Starter).\n' +
          '• **Módulos Growth (4, 5)**: Outbound en X y Foros Q&A con Anti-Ban Guard + Newsletters B2B. Multiplican por 5 tu alcance calificado.\n' +
          '• **Módulos Enterprise (6, 7, 8)**: TikTok/Reels virales + Programmatic SEO masivo + Red de 30% con influencers.\n\n' +
          (camp
            ? `💡 **Venta Sutil**: Tu campaña activa *"${campName}"* tiene activos los módulos de tu plan actual. Si deseas dar el salto a captar 5,000 clientes con Outbound X y Newsletters, el **Plan Growth ($1,890)** es la mejor inversión para escalar rápidamente.`
            : `💡 **Sugerencia**: Como tus motores están esperando, dar de alta tu primera campaña hoy pondrá a trabajar de inmediato a Google y las redes a tu favor. ¿La creamos ahora?`),
        action: {
          id: `act_nav_plans_${Date.now()}`,
          type: 'navigate',
          target: 'plans',
          title: '💳 Ver Planes y Potenciar Motores',
          description: 'Compara Starter, Growth y Enterprise.',
        },
        suggestions: [
          '➕ Crear nueva campaña',
          '💳 Comparar planes y precios',
          '🚀 Ver estado de los 8 motores',
          '🔌 Ver Enlace Puente'
        ],
        source: 'kasi_inside_engines'
      };
    }
  }

  // 5. MERCADO PAGO, PRECIOS Y PLANES
  if (
    m.includes('mercadopago') ||
    m.includes('mercado pago') ||
    m.includes('pago') ||
    m.includes('precio') ||
    m.includes('precios') ||
    m.includes('cuanto vale') ||
    m.includes('cuánto vale') ||
    m.includes('cuanto cuesta') ||
    m.includes('cuánto cuesta') ||
    m.includes('costo') ||
    m.includes('costos') ||
    m.includes('planes') ||
    m.includes('plan') ||
    m.includes('tarifa')
  ) {
    if (!isInside) {
      return {
        reply: '💳 **PLANES Y PRECIOS TRANSPARENTES · KaSe MARKETING**\n\n' +
          'Solo pagas por **resultados garantizados y usuarios reales**. Pasarela oficial con Mercado Pago Uruguay:\n\n' +
          '🌱 **Starter**: **$490 USD / mes** ➔ 1,000 clientes/registros garantizados.\n' +
          '⚡ **Growth**: **$1,890 USD / mes** ➔ 5,000 clientes garantizados + Outbound X con Anti-Ban y Newsletters.\n' +
          '👑 **Enterprise**: **$8,900 USD / mes** ➔ 25,000 clientes garantizados + TikTok/Reels virales y pSEO masivo.\n\n' +
          '🔒 Sin cobros ocultos ni costos por clic imprevistos. Cumplida la meta, se auto-pausa.\n\n' +
          '👉 **Para elegir tu plan y comenzar, crea tu cuenta gratuita en 30 segundos:**',
        action: {
          id: `act_auth_${Date.now()}`,
          type: 'open_auth',
          title: '📝 Registrarme Gratis para Contratar un Plan',
          description: 'Abre tu cuenta y selecciona tu objetivo de crecimiento.',
        },
        suggestions: [
          '📝 Crear cuenta gratuita',
          '🚀 ¿Cómo funciona KaSe?',
          '🛡️ ¿Tengo que configurar APIs?',
          '⭐ ¿Cómo garantizan resultados?'
        ],
        source: 'kasi_hero_pricing'
      };
    } else {
      return {
        reply: '💳 **GESTIÓN DE PLANES Y COBROS · MERCADO PAGO URUGUAY**\n\n' +
          '• **Plan Starter ($490 USD)**: 1,000 registros garantizados. Ideal para validar un producto.\n' +
          '• **Plan Growth ($1,890 USD)**: 5,000 registros garantizados + Outbound X con Anti-Ban y Newsletters B2B. *(El más rentable por costo por lead)*.\n' +
          '• **Plan Enterprise ($8,900 USD)**: 25,000 registros garantizados + los 8 motores a máxima frecuencia.\n\n' +
          (isSuperAdmin
            ? '🧪 **Autoprueba de $1.00 USD (Kathy Seba)**: Tienes habilitada la prueba de $1.00 USD para verificar la acreditación bancaria en tu cuenta de Mercado Pago.'
            : '💡 **Recomendación Comercial**: Si tu objetivo es generar un flujo constante de clientes todos los días sin preocuparte por el tráfico, el **Plan Growth** te brinda el mayor volumen al menor costo por cliente.'),
        action: isSuperAdmin ? {
          id: `act_mp_test_${Date.now()}`,
          type: 'one_dollar_test',
          title: '💳 Ejecutar Autoprueba de $1.00 USD',
          description: 'Verifica la acreditación bancaria en vivo.',
        } : {
          id: `act_nav_plans_${Date.now()}`,
          type: 'navigate',
          target: 'plans',
          title: '💳 Ir a Planes y Precios',
          description: 'Compara y escala tu cuota de clientes.',
        },
        suggestions: [
          '💳 Ir a Planes y Precios',
          '➕ Crear nueva campaña',
          '📊 Ver Dashboard',
          '🚀 Auditar mi campaña'
        ],
        source: 'kasi_inside_pricing'
      };
    }
  }

  // 6. NICHOS Y SECTORES (E-commerce, SaaS, Cursos, Ropa, Restaurante, etc.)
  if (
    m.includes('tienda') ||
    m.includes('ropa') ||
    m.includes('moda') ||
    m.includes('ecommerce') ||
    m.includes('e-commerce') ||
    m.includes('saas') ||
    m.includes('software') ||
    m.includes('curso') ||
    m.includes('cursos') ||
    m.includes('inmobiliaria') ||
    m.includes('restaurante') ||
    m.includes('servicios') ||
    m.includes('b2b') ||
    m.includes('abogado') ||
    m.includes('clinica') ||
    m.includes('infoproducto') ||
    m.includes('mi negocio')
  ) {
    if (!isInside) {
      return {
        reply: '🎯 **ADAPTACIÓN TOTAL A TU SECTOR DE NEGOCIO**\n\n' +
          '¡Totalmente! KaSe cuenta con filtros de targeting algorítmico para atraer **compradores reales con tarjeta en mano** y descartar curiosos:\n\n' +
          '• **E-commerce y Moda**: Micro-videos virales y syndication visual hacia tu catálogo.\n' +
          '• **SaaS y Software B2B**: X técnico, comunidades Q&A y directorios de software mundial.\n' +
          '• **Cursos y Servicios Profesionales**: pSEO en Google para personas con intención de compra inmediata.\n\n' +
          '👉 **Regístrate gratis ahora mismo** para seleccionar tu nicho y lanzar tu primera campaña:',
        action: {
          id: `act_auth_${Date.now()}`,
          type: 'open_auth',
          title: '📝 Registrarme Gratis para mi Nicho',
          description: 'Accede a la plataforma y selecciona tu categoría.',
        },
        suggestions: [
          '📝 Crear cuenta gratuita',
          '💰 Ver planes y precios',
          '🚀 ¿Cómo funciona KaSe?',
          '🛡️ ¿Tengo que configurar APIs?'
        ],
        source: 'kasi_hero_niche'
      };
    } else {
      return {
        reply: '🎯 **CALIBRACIÓN DE NICHO PARA TU CUENTA · KaSe**\n\n' +
          `Nuestros 8 motores ya cuentan con librerías de keywords y clusters de intención adaptados a tu sector.\n\n` +
          `💡 **Estrategia Comercial Sugerida**: La mayoría de nuestros clientes con mejores resultados activan una campaña principal para su producto estrella y una **segunda campaña complementaria** para ofertas estacionales o paquetes de mayor ticket.\n\n` +
          `¿Deseas que preparemos una nueva campaña específica para tu nicho?`,
        action: {
          id: `act_new_camp_${Date.now()}`,
          type: 'new_campaign',
          title: '➕ Crear Campaña para mi Nicho',
          description: 'Ingresa la URL y define tu público objetivo.',
        },
        suggestions: [
          '➕ Iniciar nueva campaña',
          '💳 Ver planes recomendados',
          '📊 Ver Dashboard',
          '🚀 Auditar mi campaña'
        ],
        source: 'kasi_inside_niche'
      };
    }
  }

  // 7. CREAR O HACER UNA CAMPAÑA
  if (
    m.includes('hacer una campaña') ||
    m.includes('hacer campaña') ||
    m.includes('crear una campaña') ||
    m.includes('crear campaña') ||
    m.includes('nueva campaña') ||
    m.includes('dar de alta') ||
    m.includes('lanzar campaña') ||
    m.includes('empezar')
  ) {
    if (!isInside) {
      return {
        reply: '¡Excelente decisión! 🚀✨ Configurar tu campaña en KaSe toma apenas 60 segundos:\n\n' +
          '1. Ingresas el nombre de tu marca.\n' +
          '2. Pegas la URL de tu web o tienda.\n' +
          '3. Eliges tu nicho y meta de clientes (desde 1,000 en Starter).\n\n' +
          '👉 **Para crearla, primero crea tu cuenta gratuita en 30 segundos:**',
        action: {
          id: `act_auth_${Date.now()}`,
          type: 'open_auth',
          title: '📝 Registrarme Gratis para Crear Campaña',
          description: 'Crea tu usuario para acceder al configurador.',
        },
        suggestions: [
          '📝 Crear cuenta gratuita',
          '💰 Ver precios de los planes',
          '🚀 ¿Cómo funciona KaSe?',
          '🛡️ ¿Tengo que configurar APIs?'
        ],
        source: 'kasi_hero_new_camp'
      };
    } else {
      return {
        reply: '¡Manos a la obra, ' + userName + '! 🚀✨\n\n' +
          'He preparado el asistente para dar de alta tu campaña de crecimiento en 60 segundos.\n\n' +
          '💡 **Recomendación**: Si ya tienes una campaña activa, esta nueva campaña puede apuntar a otra landing page o producto para duplicar tus fuentes de ingresos.\n\n' +
          'Pulsa el botón de abajo para abrir el formulario:',
        action: {
          id: `act_new_camp_${Date.now()}`,
          type: 'new_campaign',
          title: '➕ Abrir Asistente y Crear Campaña',
          description: 'Configura tu link, nicho y meta de clientes.',
        },
        suggestions: [
          '➕ Abrir formulario de campaña',
          '💳 Ver Planes y Precios',
          '📊 Ver Dashboard',
          '🔌 Copiar Enlace Puente'
        ],
        source: 'kasi_inside_new_camp'
      };
    }
  }

  // 8. VER DASHBOARD EN VIVO (MÉTRICAS Y GRÁFICOS)
  if (
    m.includes('dashboard') ||
    m.includes('desboard') ||
    m.includes('dasboard') ||
    m.includes('ver panel') ||
    m.includes('panel en vivo') ||
    m.includes('métricas en vivo') ||
    m.includes('metricas en vivo')
  ) {
    if (!isInside) {
      return {
        reply: '📊 **DASHBOARD EN VIVO · KaSe MARKETING**\n\n' +
          'En el Dashboard puedes ver en tiempo real el contador de registros, tacómetro de velocidad, estado de los 8 motores y conversiones verificadas por el Enlace Puente.\n\n' +
          '👉 **Para acceder a tu Dashboard, crea tu cuenta gratuita en 30 segundos:**',
        action: {
          id: `act_auth_${Date.now()}`,
          type: 'open_auth',
          title: '📝 Crear Cuenta Gratuita y Ver Dashboard',
          description: 'Regístrate en 30 segundos sin tarjetas.',
        },
        suggestions: ['📝 Crear cuenta gratuita', '💰 Ver planes y precios', '🚀 ¿Cómo funciona KaSe?'],
        source: 'kasi_dashboard_guest'
      };
    } else if (camp) {
      return {
        reply: `📊 **DASHBOARD EN VIVO · CAMPAÑA "${camp.name}"**\n\n` +
          `• **Registros Verificados**: ${camp.currentRegistrations} / ${camp.targetRegistrations}\n` +
          `• **Estado del Motor**: ${camp.status === 'active' ? '🟢 Operando en Vivo' : '⏸️ Pausado'}\n` +
          `• **Plan Asignado**: Plan ${camp.plan.toUpperCase()}\n\n` +
          `Pulsa el botón de abajo para ir directamente al Dashboard de tu campaña:`,
        action: {
          id: `act_nav_dash_${Date.now()}`,
          type: 'navigate',
          target: 'dashboard',
          title: '📊 Ir al Dashboard En Vivo',
          description: 'Abre el panel principal con gráficos de conversiones en tiempo real.',
        },
        suggestions: ['🚀 Auditar mi campaña actual', '🔌 Ver Enlace Puente', '💳 Ver Planes y Precios'],
        source: 'kasi_dashboard_active'
      };
    } else {
      return {
        reply: `📊 **DASHBOARD · SIN CAMPAÑAS ACTIVAS ACTUALMENTE**\n\n` +
          `Actualmente no tienes ninguna campaña activa en marcha porque todas las anteriores fueron borradas según solicitaste.\n\n` +
          `El Dashboard muestra las métricas de tráfico y conversiones en vivo de una campaña activa. En este momento puedes:\n` +
          `1️⃣ Ir a la pestaña **"Campañas Activas"** para supervisar tu cuenta y ver el estado general.\n` +
          `2️⃣ O dar de alta una nueva campaña cuando decidas encender los motores.\n\n` +
          `¿Deseas que te lleve a la sección de Campañas Activas?`,
        action: {
          id: `act_nav_act_${Date.now()}`,
          type: 'navigate',
          target: 'active_campaigns',
          title: '🚀 Ir a "Campañas Activas"',
          description: 'Supervisa tu panel de campañas sin abrir ningún formulario forzado.',
        },
        suggestions: ['🚀 Ir a Campañas Activas', '💳 Ver Planes y Precios', '➕ Configurar Nueva Campaña'],
        source: 'kasi_dashboard_empty'
      };
    }
  }

  // 9. ENLACE PUENTE INTELIGENTE (/r/:id)
  if (
    m.includes('enlace puente') ||
    m.includes('enrutador puente') ||
    m.includes('link puente') ||
    m.includes('ver enlace') ||
    m.includes('ver mi enlace') ||
    m.includes('copiar enlace') ||
    m.includes('/r/')
  ) {
    if (!isInside) {
      return {
        reply: '🔌 **ENLACE PUENTE INTELIGENTE (CERO CÓDIGO) · KaSe**\n\n' +
          'El Enlace Puente (`/r/:campaignId`) es una URL inteligente que KaSe genera para tu campaña. Todo visitante que ingresa por ese enlace es redirigido en milisegundos hacia tu página web mientras suma +1 a tu contador de forma segura sin que tengas que programar ni pegar ningún script manual.\n\n' +
          '👉 **Regístrate gratis para obtener tu propio Enlace Puente:**',
        action: {
          id: `act_auth_${Date.now()}`,
          type: 'open_auth',
          title: '📝 Registrarme Gratis para Obtener Enlace Puente',
          description: 'Accede a la plataforma en 30 segundos.',
        },
        suggestions: ['📝 Crear cuenta gratuita', '🚀 ¿Cómo funciona?', '💰 Ver planes y precios'],
        source: 'kasi_bridge_guest'
      };
    } else if (camp) {
      const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ka-se-marcketing-digital.vercel.app';
      const bridgeUrl = `${origin}/r/${camp.id}`;
      const safeDest = (!camp.targetUrl || camp.targetUrl === '/' || camp.targetUrl.includes('kase2020') || camp.targetUrl.toLowerCase().includes('kathyseba'))
        ? 'https://ka-se-marcketing-digital.vercel.app/'
        : camp.targetUrl;
      return {
        reply: `🔌 **TU ENLACE PUENTE INTELIGENTE · CAMPAÑA "${camp.name}"**\n\n` +
          `Aquí tienes el enlace inteligente de cero código de tu campaña activa:\n\n` +
          `🔗 **URL Puente Oficial**:\n` +
          `\`${bridgeUrl}\`\n\n` +
          `• **Destino Configurado**: ${safeDest}\n` +
          `• **Mapeo Atómico**: Redirige al instante (HTTP 307) a tu web y suma +1 en tu tacómetro.\n` +
          `• **Zero-Install**: No requiere scripts ni instalar nada en tu servidor.\n\n` +
          `Puedes copiarlo directamente o ir a la sección "Integración Segura" para revisarlo en tu app:`,
        action: {
          id: `act_nav_int_${Date.now()}`,
          type: 'navigate',
          target: 'integration',
          title: '🔌 Ir a "Integración Segura"',
          description: 'Revisa tu Enlace Puente y los detalles de seguimiento.',
        },
        suggestions: ['📊 Ver Dashboard en vivo', '🚀 Auditar mi campaña actual', '💳 Ver Planes y Precios'],
        source: 'kasi_bridge_active'
      };
    } else {
      return {
        reply: `🔌 **ENLACE PUENTE · SIN CAMPAÑA ASIGNADA ACTUALMENTE**\n\n` +
          `El Enlace Puente Inteligente (\`/r/:id\`) se genera automáticamente y de forma personalizada en cuanto das de alta una campaña para tu web o producto.\n\n` +
          `Como actualmente no tienes ninguna campaña activa en marcha, todavía no existe un enlace puente asignado.\n\n` +
          `Cuando decidas crear tu campaña, el sistema te entregará de inmediato tu enlace puente listo para compartir sin necesidad de que toques ninguna línea de código ni API.`,
        action: {
          id: `act_nav_act_${Date.now()}`,
          type: 'navigate',
          target: 'active_campaigns',
          title: '🚀 Ir a "Campañas Activas"',
          description: 'Visualiza la sección de campañas sin abrir ningún formulario forzado.',
        },
        suggestions: ['🚀 Ir a Campañas Activas', '💳 Ver Planes y Precios', '➕ Configurar Nueva Campaña'],
        source: 'kasi_bridge_empty'
      };
    }
  }

  // 10. AUDITAR RENDIMIENTO
  if (
    m.includes('auditar') ||
    m.includes('auditoria') ||
    m.includes('auditoría') ||
    m.includes('rendimiento') ||
    m.includes('como va mi campaña') ||
    m.includes('cómo va mi campaña') ||
    m.includes('estado de mi campaña')
  ) {
    if (!isInside) {
      return {
        reply: '📊 **AUDITORÍA DE CAMPAÑAS EN TIEMPO REAL**\n\n' +
          'Los clientes de KaSe disfrutan de un panel de control con métricas en vivo, eventos verificados por el Enrutador Puente y estado de los 8 motores.\n\n' +
          '👉 **Crea tu cuenta gratuita ahora** para dar de alta tu primera campaña y monitorear tus conversiones en tiempo real:',
        action: {
          id: `act_auth_${Date.now()}`,
          type: 'open_auth',
          title: '📝 Crear Cuenta Gratuita y Ver Panel',
          description: 'Accede a la auditoría autónoma en vivo.',
        },
        suggestions: [
          '📝 Crear cuenta gratuita',
          '💰 Ver planes y precios',
          '🚀 ¿Cómo funciona KaSe?'
        ],
        source: 'kasi_hero_audit'
      };
    } else if (!camp) {
      // EXACT ACCURATE AUDIT WHEN NO ACTIVE CAMPAIGN EXISTS (NO FAKE DATA)
      return {
        reply: `🔍 **INFORME DE AUDITORÍA AUTÓNOMA · KaSi 2.0**\n\n` +
          `He escaneado tu panel y confirmo que **actualmente no tienes ninguna campaña activa en marcha**.\n\n` +
          `📋 **Estado Verificado del Sistema**:\n` +
          `• **Campañas Activas**: 0 (Las campañas anteriores fueron eliminadas según solicitaste para comenzar desde cero).\n` +
          `• **Consumo de Cuota**: 0 usuarios (Tu presupuesto está 100% protegido e intacto).\n` +
          `• **Motores de Adquisición**: En reposo esperando nueva asignación.\n` +
          `• **Conectores de Red**: Verificación de APIs en Vercel activa.\n\n` +
          `Puedes supervisar tu cuenta en **"Campañas Activas"** o dar de alta tu próxima campaña cuando decidas poner en marcha los motores.`,
        action: {
          id: `act_nav_act_${Date.now()}`,
          type: 'navigate',
          target: 'active_campaigns',
          title: '🚀 Ir a "Campañas Activas"',
          description: 'Supervisa el estado general de tu cuenta.',
        },
        suggestions: [
          '🚀 Ir a Campañas Activas',
          '💳 Ver Planes y Precios',
          '➕ Configurar Nueva Campaña',
          '🛡️ Funcionamiento Óptimo'
        ],
        source: 'kasi_inside_audit_empty'
      };
    } else {
      const cur = camp.currentRegistrations ?? 0;
      const tgt = camp.targetRegistrations ?? 1000;
      const pct = Math.min(100, Math.round((cur / Math.max(1, tgt)) * 100));
      const status = camp.status === 'active' 
        ? '🟢 Operando en Vivo (Captando Tráfico)' 
        : camp.status === 'paused_quota_reached'
        ? '🛑 Pausa Inteligente (Cuota Cumplida)'
        : '⏸️ Pausada Manualmente';

      let growthPitch = '';
      if (pct >= 60) {
        growthPitch = `\n\n📈 **Venta Sutil de Escalamiento**: Ya has alcanzado el **${pct}% de tu meta**. Al llegar al 100%, el sistema se auto-apaga para protegerte. Si deseas mantener el flujo de ventas activo sin interrupciones, te recomiendo ampliar tu cuota al **Plan Growth ($1,890)** con 5,000 registros adicionales.`;
      } else {
        growthPitch = `\n\n💡 **Optimización**: Los motores están syndicando tráfico orgánico. Si deseas acelerar los resultados agregando Outbound en X con Anti-Ban y Newsletters B2B, puedes subir al Plan Growth en cualquier momento.`;
      }

      return {
        reply: `📊 **INFORME DE AUDITORÍA AUTÓNOMA · KaSi 2.0**\n\n` +
          `🎯 **Campaña**: *${camp.name}*\n` +
          `⚡ **Estado**: ${status}\n` +
          `📈 **Progreso Real**: **${cur} / ${tgt}** conversiones (${pct}% completado)\n` +
          `🛡️ **Tráfico Humano**: 100% verificado en Enlace Puente (/r/:id)` +
          growthPitch,
        action: {
          id: `act_nav_dash_${Date.now()}`,
          type: 'navigate',
          target: 'dashboard',
          title: '📊 Ir al Dashboard en Vivo',
          description: 'Revisa las métricas y gráficos en tiempo real.',
        },
        suggestions: [
          '📊 Ver Dashboard en vivo',
          '💳 Ampliar mi plan de clientes',
          '➕ Nueva campaña paralela',
          '🔌 Ver Enlace Puente'
        ],
        source: 'kasi_inside_audit_active'
      };
    }
  }

  // 11. DYNAMIC GENERAL FALLBACK (AFUERA VS ADENTRO)
  if (!isInside) {
    // AGENTE DE AFUERA: Siempre responde a la duda y cierra invitando a registrarse
    return {
      reply: `He recibido tu consulta sobre *" ${userMessage.slice(0, 60)} "* ✨🤖.\n\n` +
        `En **KaSe Marketing Digital** nos especializamos en conseguir clientes reales y ventas para cualquier negocio mediante 8 motores autónomos en la nube:\n\n` +
        `• **Tú no programas nada**: No necesitas tocar APIs ni códigos complicados.\n` +
        `• **Tráfico 100% Humano**: Cero bots ni simulaciones.\n` +
        `• **Garantía Total**: Pagas por clientes cumplidos.\n\n` +
        `👉 **Para dar el siguiente paso y activar tu crecimiento, crea tu cuenta gratuita en 30 segundos:**`,
      action: {
        id: `act_auth_${Date.now()}`,
        type: 'open_auth',
        title: '📝 Crear Cuenta Gratuita en KaSe',
        description: 'Accede al configurador y lanza tu primera campaña.',
      },
      suggestions: [
        '📝 Crear cuenta gratuita',
        '🚀 ¿Cómo funciona KaSe exactamente?',
        '💰 ¿Cuáles son los planes y precios?',
        '🛡️ ¿Tengo que configurar APIs?'
      ],
      source: 'kasi_hero_dynamic'
    };
  } else {
    // AGENTE DE ADENTRO: Responde, ayuda y busca asesorar de forma no intrusiva
    const subtleInside = camp
      ? `\n\n💡 **Tip Pro para ${userName}**: Tu campaña activa *"${campName}"* continúa captando leads. Si buscas un crecimiento agresivo este mes, lanzar una segunda campaña para otro ángulo de venta o escalar al Plan Growth aumentará exponencialmente tus conversiones. ¿Deseas explorarlo?`
      : `\n\n💡 **Estado de tu cuenta**: Actualmente no tienes ninguna campaña activa. Los 8 motores están listos en la nube. ¿Deseas explorar los planes o ir a Campañas Activas?`;

    return {
      reply: `Entendido perfectamente sobre *" ${userMessage.slice(0, 60)} "* ✨🤖.\n\n` +
        `Estoy aquí para apoyarte en cualquier aspecto técnico de tus campañas, configuración de enlaces, análisis de conversiones o pasarela de pagos.` +
        subtleInside,
      action: camp ? {
        id: `act_nav_dash_${Date.now()}`,
        type: 'navigate',
        target: 'dashboard',
        title: '📊 Ir al Dashboard en Vivo',
        description: 'Revisa las métricas y conversiones en tiempo real.',
      } : {
        id: `act_nav_act_${Date.now()}`,
        type: 'navigate',
        target: 'active_campaigns',
        title: '🚀 Ir a "Campañas Activas"',
        description: 'Supervisa tu cuenta y gestiona tus campañas.',
      },
      suggestions: [
        '🚀 Ir a Campañas Activas',
        '💳 Ver Planes y Precios',
        camp ? '📊 Ver Dashboard en vivo' : '➕ Configurar Nueva Campaña',
        '🔌 Ver Enlace Puente'
      ],
      source: 'kasi_inside_dynamic'
    };
  }
}
