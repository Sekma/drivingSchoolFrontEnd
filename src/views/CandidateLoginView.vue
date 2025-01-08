<template>
    <div class="m-auto mt-5 p-3 w-50" style="box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5)">
        <div class="text-center">
            <h1 class="text-muted">Connexion Candidat</h1>
        </div>
      <form class="mt-3 d-flex flex-column align-items-center" @submit.prevent="login">
        <div class="form-group w-50">
          <label for="pseudo" class="text-dark fw-bold">Pseudo</label>
          <input class="form-control border-bottom mt-2" type="text" v-model="pseudo" id="pseudo" placeholder="Entrez votre pseudo" />
        </div>
        <div class="form-group mt-3 w-50">
          <label for="password"  class="text-dark fw-bold">Mot de passe</label>
          <input class="form-control border-bottom mt-2" type="password" v-model="password" id="password" placeholder="Password"/>
        </div>
        <button class="btn btn-primary mt-4 w-25 text-white rounded fw-bold" type="submit">Se connecter</button>
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
  