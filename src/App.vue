<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith('/admin'));
const isCandidateRoute = computed(() => route.path.startsWith('/candidate'));
  
</script>

<template>
  <div>
    <nav v-if="!isAdminRoute" class="p-2 d-flex">
      <RouterLink to="/" class="nav-link ms-5">Accueil</RouterLink>
      <RouterLink to="/candidate/courses" class="nav-link ms-2">Cours</RouterLink>
      <RouterLink to="/candidate/reservation" class="nav-link ms-2">Réservation</RouterLink>
      <button v-if="isCandidateRoute" @click="logout" class="btn text-danger ms-auto me-5">Déconnexion</button>
    </nav>

    <!-- Contenu principal -->
    <main>
      <RouterView />
    </main>

    
  </div>
</template>
<script>
import axios from "axios";

export default {
  methods : {
// déconnexion
logout() {
  if (confirm("Are you sure you want to log out?")) {
    axios.post('http://localhost:8000/api/candidates/logout', {}, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('candidateToken')}`
        }
    })
    .then(response => {
        // Supprimer le token
        localStorage.removeItem('candidateToken');
        localStorage.removeItem('candidateName');

        // Rediriger vers la page de connexion
        this.$router.push('/login-candidate');
    })
    .catch(error => {
        console.log(error);
        // Nettoyage même en cas d'erreur
        localStorage.removeItem('candidateToken');
        localStorage.removeItem('candidateName');
        this.$router.push('/login-candidate');
    });
  }
}
  }
}
</script>

<style scoped>
nav {
  font-size: 12px;
  text-align: start;
  border-bottom: 1px solid grey;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.3)
}
nav a {
  color: black;
}
nav a.router-link-exact-active {
  color: rgb(0, 150, 0);
}
nav a:hover{
  color: #FFA500;
  transition: all 0.5;
}


nav a.router-link-exact-active:hover {
  color: rgb(0, 150, 0);
  cursor: default;
  
}
nav a, nav button{
  display: inline-block;
  padding: 0.2rem 1rem;
  border-left: 1px solid var(--color-border);
  font-weight: bold;
  text-decoration: none;
}
nav a:first-of-type {
  border: 0;
} 

@media (min-width: 1024px) {

  nav {
    width: 100%;
    font-size: 1rem;
    padding: 0.5rem 0;
  }
  nav .logo{
    margin-left: 150px;
  }
  nav .link:first-of-type{
    margin-left: 50px;
  }
}
</style>

