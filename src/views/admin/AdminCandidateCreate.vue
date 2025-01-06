<template>
    <div class="create-candidate">
      <h1>Créer un nouveau candidat</h1>
      <form @submit.prevent="createCandidate">
        <div class="form-group">
          <label for="name">Nom</label>
          <input type="text" id="name" v-model="name" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="pseudo">Pseudo</label>
          <input type="text" id="pseudo" v-model="pseudo" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-success">Créer</button>
        <button @click.prevent="goBack" class="btn btn-secondary ml-2">Annuler</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        name: "",
        pseudo: "",
        password: "",
      };
    },
    methods: {
      createCandidate() {
        axios
          .post(
            "http://localhost:8000/api/admin/candidates",
            {
              name: this.name,
              pseudo: this.pseudo,
              password: this.password,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            alert("Candidat créé avec succès !");
            this.$router.push("/admin/candidates");
          })
          .catch((error) => {
            console.error("Erreur lors de la création du candidat", error);
            alert("Échec de la création du candidat. Vérifiez les données saisies.");
          });
      },
      goBack() {
        this.$router.push("/admin/candidates");
      },
    },
  };
  </script>
  
  <style scoped>
  .create-candidate {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  