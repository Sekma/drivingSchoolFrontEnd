<template>
  <div class="reservations-container">
    <h4 class="text-center">Mes Réservations</h4>

    <!-- Vérifier s'il y a des réservations -->
    <div v-if="reservations.length > 0">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Horaire</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reservation, index) in reservations" :key="reservation.id">
            <td>{{ index + 1 }}</td>
            <td>{{ reservation.date }}</td>
            <td>{{ reservation.time_slot }}</td>
            <td :class="getStatusClass(reservation.status)">
              {{ getStatusLabel(reservation.status) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Message si aucune réservation n'est trouvée -->
    <div v-else>
      <p>Aucune réservation trouvée.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      reservations: [], // Liste des réservations
    };
  },
  methods: {
    // Récupérer les réservations pour le candidat connecté
    fetchReservationsByCandidate() {
      const token = localStorage.getItem("candidateToken"); // Récupérer le token du candidat
      const candidateId = localStorage.getItem("candidateId"); // Récupérer l'ID du candidat
      const url = `http://localhost:8000/api/candidates/${candidateId}/reservations`;

      // Effectuer une requête GET pour récupérer les données
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token pour l'authentification
          },
        })
        .then((response) => {
          console.log("Réservations récupérées :", response.data.reservations);
          this.reservations = response.data.reservations; // Mettre à jour la liste des réservations
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des réservations :", error.response || error.message);
          alert("Erreur lors de la récupération des réservations.");
        });
    },

    // Obtenir un label pour chaque statut
    getStatusLabel(status) {
      switch (status) {
        case "pending":
          return "En attente";
        case "confirmed":
          return "Confirmé";
        case "rejected":
          return "Rejeté";
        default:
          return "Inconnu";
      }
    },

    // Ajouter une classe CSS en fonction du statut
    getStatusClass(status) {
      switch (status) {
        case "pending":
          return "status-pending";
        case "confirmed":
          return "status-confirmed";
        case "rejected":
          return "status-rejected";
        default:
          return "";
      }
    },
  },
  mounted() {
    this.fetchReservationsByCandidate(); // Récupérer les réservations au chargement de la page
  },
};
</script>

<style scoped>
.reservations-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  max-width: 900px;
  border-collapse: collapse;
  margin: 20px auto;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

table th {
  background-color: #f4f4f4;
  color: #333;
}

.status-pending {
  color: orange;
}

.status-confirmed {
  color: green;
}

.status-rejected {
  color: red;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filters select {
  padding: 5px;
}

p {
  text-align: center;
  color: #666;
}
</style>

