import { createRouter, createWebHistory } from "vue-router";
//home
import HomeView from "@/views/HomeView.vue";
//admin
import AdminLoginView from "../views/admin/AdminLoginView.vue";
import AdminLayout from "@/views/admin/AdminLayout.vue";
import AdminDashboard from "../views/admin/AdminAdminDashboard.vue";
import AdminCandidateView from "@/views/admin/AdminCandidateView.vue";
import AdminCandidateCreate from "@/views/admin/AdminCandidateCreate.vue";
import AdminReservationsView from "@/views/admin/AdminReservationsView.vue";
//candidate
import CandidateLoginView from "../views/CandidateLoginView.vue";
import ReservationView from "../views/ReservationView.vue";
import CoursesView from "@/views/CoursesView.vue";

const routes = [
  //home
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  //admin
  {
    path: "/login",
    name: "AdminLogin",
    component: AdminLoginView,
  },
  {
      path: '/admin',
      component: AdminLayout, // Utiliser le layout
      meta: { requiresAdminAuth: true }, // Middleware pour admin
      children: [
        {
          path: '',
          name: "AdminDashboard",
          component: AdminDashboard,
        },
        {
          path: "/admin/candidates",
          name: "AdminCandidates",
          component: AdminCandidateView,
        },
        {
          path: "/admin/candidates/create",
          name: "AdminCandidateCreate",
          component: AdminCandidateCreate,
        },
        {
          path: "/admin/reservations",
          name: "AdminReservations",
          component: AdminReservationsView,
        },
      ]
  },
  //candidate
  {
    path: "/login-candidate",
    name: "CandidateLogin",
    component: CandidateLoginView,
  },
  {
    path: "/candidate/reservation",
    name: "ReservationView",
    component: ReservationView,
    meta: { requiresCandidateAuth: true }, // Middleware pour candidat
  },
  {
    path: "/candidate/courses",
    name: "CoursesView",
    component: CoursesView,
    meta: { requiresCandidateAuth: true }, // Middleware pour candidat
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware pour sécuriser les routes
router.beforeEach((to, from, next) => {
  // Vérification pour les administrateurs
  if (to.meta.requiresAdminAuth) {
    const adminToken = localStorage.getItem("token");
    if (!adminToken) {
      next("/login"); // Redirige vers la page de connexion admin
    } else {
      next(); // Laisse passer si le token admin existe
    }
  }

  // Vérification pour les candidats
  else if (to.meta.requiresCandidateAuth) {
    const candidateToken = localStorage.getItem("candidateToken");
    if (!candidateToken) {
      next("/login-candidate"); // Redirige vers la page de connexion candidat
    } else {
      next(); // Laisse passer si le token candidat existe
    }
  } else {
    next(); // Aucune restriction sur cette route
  }
});

export default router;