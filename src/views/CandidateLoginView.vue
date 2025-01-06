<template>
    <div class="m-auto mt-5 p-3 w-50" style="box-shadow: 0 2px 10px rgba(255, 255, 255, 0.3)">
        <div class="text-center">
            <h1 class="text-muted">Connexion Candidat</h1>
        </div>
      <form class="mt-3" @submit.prevent="login">
        <div class="form-group">
          <label for="pseudo">Pseudo</label>
          <input class="form-control border-bottom mt-2" type="text" v-model="pseudo" id="pseudo" placeholder="Entrez votre pseudo" />
        </div>
        <div class="form-group mt-3">
          <label for="password">Mot de passe</label>
          <input class="form-control border-bottom mt-2" type="password" v-model="password" id="password" placeholder="Password"/>
        </div>
        <button class="btn btn-primary mt-4 w-50 text-white rounded-pill fw-bold" type="submit">Se connecter</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        pseudo: "",
        password: "",
      };
    },
    methods: {
      login() {
            axios.post('http://localhost:8000/api/candidates/login', {
          pseudo: this.pseudo,
          password: this.password
      })
      .then(response => {
          // Sauvegarder le token et le nom dans localStorage
          localStorage.setItem('candidateToken', response.data.token);
          localStorage.setItem('candidateId', response.data.id);
          localStorage.setItem('candidateName', response.data.name);

          // Redirection après connexion
          this.$router.push('/candidate/courses');
      })
      .catch(error => {
          console.log(error);
          alert('Identifiants incorrects.');
          // Réinitialiser les champs de connexion
          this.pseudo = '';
          this.password = '';
  });

      },
    },
  };
  </script>
  
  <style>

  </style>
  