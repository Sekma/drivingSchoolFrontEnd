<template>
    <div class="admin-candidates">
      <h1>Liste des Candidats</h1>
      <button @click="goToCreateForm" class="btn btn-primary mb-4">Créer un nouveau candidat</button>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Pseudo</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(candidate, index) in candidates" :key="candidate.id">
            <td>{{ index + 1 }}</td>
            <td>{{ candidate.name }}</td>
            <td>{{ candidate.pseudo }}</td>
            <td><a class="btn btn-outline-danger fw-bold" @click="deleteCandidate(candidate.id, candidate.name)">Delete</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        candidates: [],
      };
    },
    methods: {
      fetchCandidates() {
        axios
          .get("http://localhost:8000/api/admin/candidates", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            this.candidates = response.data;

            console.log(this.candidates)
          })
          .catch((error) => {
            console.error("Erreur lors du chargement des candidats", error);
          });
      },
      goToCreateForm() {
        this.$router.push("/admin/candidates/create");
      },
      deleteCandidate(candidateId, candidateName){
        if(confirm("Are you sure you want delete " +candidateName+ " ?")){
            axios
            .delete('http://localhost:8000/api/admin/candidates/' + candidateId, {
            headers: {
                 Authorization: `Bearer ${localStorage.getItem("token")}`
            }
            })
            .then(response => {
            alert('Candidat supprimé avec succès');
            
            location.reload(); 
            })
            .catch(error => {
            console.error('Erreur lors de la suppression du candidat:', error);
            });
        }
      }
    },
    mounted() {
      this.fetchCandidates();
    },
  };
  </script>
  
  <style scoped>
  .admin-candidates {
    padding: 20px;
  }
  </style>
  