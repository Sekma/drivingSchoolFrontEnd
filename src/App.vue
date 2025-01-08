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
      <RouterLink to="/candidate/courses" class="nav-link">Cours</RouterLink>
      <RouterLink to="/candidate/reservation" class="nav-link">Réservation</RouterLink>
      <button v-if="isCandidateRoute" @click="logout" class="btn btn-outline-danger ms-auto me-5">Déconnexion</button>
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  background-color: rgba(255, 255, 255, 0.2);
}
nav a {
  color: black;
}
nav a.router-link-exact-active {
  color: rgb(0, 150, 0);
  background-color: #f8f9fa9f;
}
nav a:hover{
  background-color: #f8f9fa;
  transition: all 0.5;
}
nav a.router-link-exact-active:hover {
  color: rgb(0, 150, 0);  
}
nav a, nav button{
  display: inline-block;
  padding: 0.2rem 1rem;
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

