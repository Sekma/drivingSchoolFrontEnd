<template>
    <div class="admin-reservations">
      <h1>Gestion des Réservations</h1>
      
      <!-- Filtre des réservations -->
      <div class="filters">
        <label for="statusFilter">Filtrer par statut :</label>
        <select v-model="statusFilter" @change="fetchReservations">
          <option value="">Tous</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmé</option>
          <option value="rejected">Rejeté</option>
        </select>
      </div>
      
      <!-- Liste des réservations -->
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du candidat</th>
            <th>Date</th>
            <th>Créneau horaire</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservations" :key="reservation.id">
            <td>{{ reservation.id }}</td>
            <td>{{ reservation.candidate.name }}</td>
            <td>{{ reservation.date }}</td>
            <td>{{ reservation.time_slot }}</td>
            <td>{{ reservation.status }}</td>
            <td>
              <button @click="updateReservationStatus(reservation.id, 'confirmed')" :disabled="reservation.status === 'confirmed'">Confirmer</button>
              <button @click="updateReservationStatus(reservation.id, 'rejected')" :disabled="reservation.status === 'rejected'">Rejeter</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "AdminReservationsView",
    data() {
      return {
        reservations: [],
        statusFilter: "",
      };
    },
    methods: {
      // Récupérer les réservations depuis le backend
      fetchReservations() {
        const token = localStorage.getItem("token");

        // Ajouter le paramètre de filtre
        const params = this.statusFilter ? { status: this.statusFilter } : {};

        axios
            .get("http://localhost:8000/api/admin/reservations", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            })
            .then((response) => {
                this.reservations = response.data.reservations;
                console.log("Réservations mises à jour :", this.reservations);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des réservations :", error.response || error.message);
                alert("Erreur lors de la récupération des réservations.");
            });
    },
  
        // Mettre à jour le statut d'une réservation
        updateReservationStatus(id, status) {
        const token = localStorage.getItem("token"); // Token de l'administrateur

        axios
            .patch(
            `http://localhost:8000/api/admin/reservations/${id}/status`, // Chemin corrigé
            { status },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            )
            .then((response) => {
            alert("Statut mis à jour avec succès !");
            this.fetchReservations(); // Actualiser les réservations
            })
            .catch((error) => {
            console.error(error);
            alert("Erreur lors de la mise à jour du statut.");
            });
        },
    },
    mounted() {
      // Charger les réservations au montage du composant
      this.fetchReservations();
    },
  };
  </script>
  
  <style scoped>
  .admin-reservations {
    padding: 20px;
  }
  
  .filters {
    margin-bottom: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  button {
    margin-right: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  