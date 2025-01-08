<template>
    <div class="m-auto mt-5 p-3 w-50" style="box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5)">
        <div class="text-center">
            <h1 class="text-muted">Connexion Admin</h1>
        </div>
      <form class="mt-3 d-flex flex-column align-items-center" @submit.prevent="login">
        <div class="form-group w-50">
          <label class="text-dark fw-bold" for="exampleInputEmail1">Adresse Email</label>
          <input v-model="email" type="email" class="form-control border-bottom mt-2" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Entrez votre email">
        </div>
        <div class="form-group mt-3 w-50">
          <label class="text-dark fw-bold" for="exampleInputPassword1">Mot De Passe</label>
          <input v-model="password"  type="password" class="form-control border-bottom mt-2" id="exampleInputPassword1" placeholder="Password">
        </div>
        <button type="submit" class="btn btn-primary mt-4 w-25 text-white rounded fw-bold">Se connecter</button>
      </form>
    </div>
  </template>
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      login() {
        axios.post("http://localhost:8000/api/login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            localStorage.setItem("token", response.data.access_token);

            this.$router.push("/admin");
          })
          .catch((error) => {
            alert("Login failed");
            
          // Réinitialiser les champs de connexion
          this.email = '';
          this.password = '';
          });
      },

   },
  };
  </script>
