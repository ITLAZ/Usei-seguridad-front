import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicio from '../views/PaginaInicio.vue'
import EncuestaEstudiante from '../views/EncuestaEstudiante.vue'
import ResumePage from '../views/ResumePage.vue' 
import GestionDirectores from '../views/GestionDirectores.vue'
import EnviarEncuesta from '../views/EnviarEncuesta.vue'
import EnProgreso from '@/views/EnProgreso.vue'
import EditarEncuesta from '../views/EditarEncuesta.vue'
import ListadoEstudiantes from '../views/ListadoEstudiantes.vue'
import GestionOpcionesPregunta from '../views/GestionOpcionesPregunta.vue'
import NoticiaForm from '@/views/NoticiaForm.vue'
import GestionEncuestas from '@/views/GestionEncuestas.vue'
import ContactoAdmin from '../views/ContactoAdmin.vue'
import FormularioSoporte from '@/views/FormularioSoporte.vue'
import RespuestasEstudiante from '@/views/RespuestasEstudiante.vue'
import VerRespuestas from '../views/VerRespuestas.vue'
import subirCertificado from '@/views/SubirCertificado.vue'
import EstudiantesRegistrados from '@/views/EstudiantesRegistrados.vue'
import FormularioPlazos from '@/views/FormularioPlazos.vue'
import PorcentajeIncompleto from '@/views/PorcentajeIncompleto.vue'
import CertificadoEstudiante from '@/views/CertificadoEstudiante.vue'
import Dashboard from '@/views/Dashboard.vue'
import AccesoDenegado from '@/components/AccesoDenegado.vue'
import ReporteDash from '@/views/ReporteDash.vue' // Importa la nueva vista
import SoporteDirector from '@/views/SoporteDirector.vue'
import VerPreguntas from '@/views/VerPreguntas.vue'
import HistorialReportes from '@/views/HistorialReportes.vue'
import CrearReporteDirector from '@/views/CrearReporteDirector.vue'
import EstadoEstudiante from '@/views/EstadoEstudiante.vue'
import MenuSeguridad from '@/views/MenuSeguridad.vue'
import GestionUsuariosRoles from '@/views/GestionUsuariosRoles.vue'
import AnalisisRiesgos from '@/views/AnalisisRiesgos.vue'
import LogUsuario from '@/views/LogUsuario.vue'


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// Definir las rutas con accessKey en meta para protección por acceso
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: PaginaInicio
    },
    {
      path: '/menu-usuario',
      name: 'menuUsuario',
      component: () => import('@/views/MenuUsuario.vue'),
      meta: { requiresAuth: true }
    },
    {
      path:'/encuesta-estudiante',
      name: 'encuestaEstudiante',
      component: EncuestaEstudiante,
      meta: { requiresAuth: true, accessKey: 'Ver Encuesta de graduación' }
    },
    {
      path: '/resumen',
      name: 'ResumePage',
      component: ResumePage,
      meta: { requiresAuth: true, accessKey: 'Ver Encuesta de graduación' }
    },
    {
      path: '/gestion-directores',
      name: 'GestionDirectores',
      component: GestionDirectores,
      meta: { requiresAuth: true, accessKey: 'ABM Directores' }
    },
    {
      path: '/enviar-encuesta',
      name: 'EnviarEncuesta',
      component: EnviarEncuesta,
      meta: { requiresAuth: true, accessKey: 'Ver Encuesta de graduación' }
    },
    {
      path: '/en-progreso',
      name: 'EnProgreso',
      component: EnProgreso,
      meta: { requiresAuth: true }
    },
    {
      path: '/editar-encuesta/:idEncuesta/preguntas',
      name: 'EditarEncuesta',
      component: EditarEncuesta,
      meta: { requiresAuth: true, accessKey: 'Editar Encuesta' }
    },
    {
      path: '/listado-estudiantes',
      name: 'ListadoEstudiantes',
      component: ListadoEstudiantes,
      meta: { requiresAuth: true, accessKey: 'Listado Estudiantes' }
    },
    {
      path: '/preguntas/:idPregunta/opciones',
      name: 'GestionOpcionesPregunta',
      component: GestionOpcionesPregunta,
      meta: { requiresAuth: true, accessKey: 'Editar Encuesta' }
    },
    {
      path: '/noticia-form',
      name: 'NoticiaForm',
      component: NoticiaForm,
      meta: { requiresAuth: true, accessKey: 'ABM Noticias/Anuncios' }
    },
    {
      path: '/gestion-encuestas/:idUsuario',
      name: 'GestionEncuestas',
      component: GestionEncuestas,
      meta: { requiresAuth: true, accessKey: 'Editar Encuesta' }
    },
    {
      path: '/contacto-admin',
      name: 'ContactoAdmin',
      component: ContactoAdmin,
      meta: { requiresAuth: true, accessKey: 'Soporte/Ayuda' }
    },
    {
      path: '/formulario-soporte',
      name: 'FormularioSoporte',
      component: FormularioSoporte,
      meta: { requiresAuth: true, accessKey: 'Soporte/Ayuda' }
    },
    {
      path: '/formulario-plazos',
      name: 'FormularioPlazos',
      component: FormularioPlazos,
      meta: { requiresAuth: true, accessKey: 'Configuración de Plazos' }
    },
    {
      path: '/respuestas-estudiante/:idEstudiante',
      name: 'RespuestasEstudiante',
      component: RespuestasEstudiante,
      meta: { requiresAuth: true, accessKey: 'Ver Encuesta de graduación' }
    },
    {
      path: '/vista-respuestas/:idEstudiante',
      name: 'VerRespuestas',
      component: VerRespuestas,
      meta: { requiresAuth: true, accessKey: 'Ver Encuesta de graduación' }
    },
    {
      path: '/subir-certificado',
      name: 'subir-certificado',
      component: subirCertificado,
      meta: { requiresAuth: true, accessKey: 'Editar Certificado' }
    },
    {
      path: '/estudiantes-registrados',
      name: 'EstudiantesRegistrados',
      component: EstudiantesRegistrados,
      meta: { requiresAuth: true, accessKey: 'Listado Estudiantes' }
    },
    {
      path: '/porcentaje-incompleto',
      name: 'PorcentajeIncompleto',
      component: PorcentajeIncompleto,
      meta: { requiresAuth: true, accessKey: 'Datos Estadísticos' }
    },
    {
      path: '/certificado-estudiante',
      name: 'certificado-estudiante',
      component: CertificadoEstudiante,
      meta: { requiresAuth: true, accessKey: 'Editar Certificado' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, accessKey: 'Dashboard' }
    },
    {
      path: '/reporte-dash',
      name: 'ReporteDash',
      component: ReporteDash,
      meta: { requiresAuth: true, accessKey: 'Datos Estadísticos' }
    },
    {
      path: '/acceso-denegado',
      name: 'AccesoDenegado',
      component: AccesoDenegado
    },
    {
      path: '/soporte-director',
      name: 'SoporteDirector',
      component: SoporteDirector,
      meta: { requiresAuth: true, accessKey: 'Soporte/Ayuda' }
    },
    {
      path: '/lista-preguntas',
      name: 'ListaPreguntas',
      component: VerPreguntas,
      meta: { requiresAuth: true, accessKey: 'Editar Encuesta' }
    },
    {
      path: '/historial-reportes',
      name: 'HistorialReportes',
      component: HistorialReportes,
      meta: { requiresAuth: true, accessKey: 'Datos Estadísticos' }
    },
    {
      path: '/crear-reporte-director',
      name: 'CrearReporteDirector',
      component: CrearReporteDirector,
      meta: { requiresAuth: true, accessKey: 'Datos Estadísticos' }
    },
    {
      path: '/estado-estudiante',
      name: 'EstadoEstudiante',
      component: EstadoEstudiante,
      meta: { requiresAuth: true, accessKey: 'Seguimiento de estudiantes' }
    },
    {
      path: '/menu-seguridad',
      name: 'MenuSeguridad',
      component: MenuSeguridad,
      meta: { requiresAuth: true, accessKey: 'Gestión de contraseñas' }
    },
    {
      path: '/gestion-usuarios-roles',
      name: 'GestionUsuariosRoles',
      component: GestionUsuariosRoles,
      meta: { requiresAuth: true, accessKey: 'Gestión de usuarios y roles' }
    },
    {
      path: '/log-usuario',
      name: 'LogUsuario',
      component: LogUsuario,
      meta: { requiresAuth: true, accessKey: 'Revisión de Logs' }
    },
    {
      path: '/analisis-riesgos',
      name: 'AnalisisRiesgos',
      component: AnalisisRiesgos,
      meta: { requiresAuth: true, accessKey: 'Análisis de riesgos' }
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});


// Protección de rutas basada en accesos
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('authToken');
  // Accesos del usuario guardados en localStorage como array de strings
  let userAccesses = [];
  try {
    userAccesses = JSON.parse(localStorage.getItem('accesos') || '[]');
  } catch (e) {
    userAccesses = [];
  }

  // Si la ruta requiere autenticación y no hay token, redirige al inicio
  if (requiresAuth && !token) {
    return next({ path: '/' });
  }

  // Si la ruta requiere acceso específico, verifica si el usuario lo tiene
  const requiredAccess = to.meta.accessKey;
  if (requiresAuth && requiredAccess) {
    // Normaliza espacios y mayúsculas/minúsculas
    const normalizedAccesses = userAccesses.map(a => a.trim().toLowerCase());
    const normalizedRequired = requiredAccess.trim().toLowerCase();
    if (!normalizedAccesses.includes(normalizedRequired)) {
      return next({ name: 'AccesoDenegado' });
    }
  }

  // Si todo está bien, permitir el acceso a la ruta
  next();
});


export default router
