<template>
  <div>
    <h4>Bonjour <span class="text-primary">{{ candidateName }}</span> ..!</h4>
  <div class="reservation">
    <!-- Intégration du calendrier -->
    <div class="calendar">
      <div class="calendar-header">
        <select v-model="selectedMonth" @change="generateCalendar">
          <option v-for="(month, index) in months" :key="index" :value="index">
            {{ month }}
          </option>
        </select>
        <select v-model="selectedYear" @change="generateCalendar">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div class="calendar-days">
        <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      </div>

      <div class="calendar-body">
        <div
  v-for="cell in calendarCells"
  :key="cell.id"
  :class="['calendar-cell', { empty: cell.isEmpty, selected: cell.isSelected, disabled: cell.isDisabled }]"
  @click="!cell.isDisabled && toggleSelection(cell)"> <!-- Empêche les clics si désactivé -->
  {{ cell.day || '' }}
</div>

      </div>
    </div>

    <!-- Affichage des créneaux horaires si un jour est sélectionné -->
    <div v-if="selectedDay" class="time-slots">
      <h4 class="text-center">Créneaux horaires pour le {{ selectedDay }}/{{ selectedMonth + 1 }}/{{ selectedYear }}</h4>
      <table>
        <thead>
          <tr>
            <th>Horaire</th>
            <th>Réservation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(slot, index) in timeSlots" :key="index">
            <td>{{ slot }}</td>
            <td>
              <button
                :disabled="isSlotDisabled(index)"
                :class="{
                  reserved: isSlotReserved(index),
                  disabled: isSlotDisabled(index)
                }"
                @click="toggleSlotReservation(index)"
              >
                {{ isSlotDisabled(index) ? 'Indisponible' : isSlotReserved(index) ? 'Annuler' : 'Réserver' }}
              </button>
            </td>
            
            
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Bouton de soumission -->
  <div v-if="selectedDay && reservedSlots.length > 0" class="submit-reservation">
    <button @click="submitReservations">Envoyer les réservations</button>
  </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      candidateName: '', // Pour stocker le nom du candidat
      months: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ],
      daysOfWeek: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
      years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i),
      calendarCells: [],
      selectedDay: null, // Stocke le jour sélectionné
      timeSlots: [
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
      ],
      reservedSlots: [], // Stocke les index des créneaux réservés
    };
  },
  methods: {
    generateCalendar() {
  this.calendarCells = [];
  const firstDay = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
  const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
  const startDay = firstDay === 0 ? 6 : firstDay - 1; // Ajustement pour Lundi = 0

  const today = new Date(); // Date actuelle

  for (let i = 0; i < startDay; i++) {
    this.calendarCells.push({ id: `empty-${i}`, isEmpty: true, day: null, isSelected: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(this.selectedYear, this.selectedMonth, day);

    this.calendarCells.push({
      id: `day-${day}`,
      isEmpty: false,
      day,
      isSelected: false,
      isDisabled: cellDate < today.setHours(0, 0, 0, 0), // Comparaison avec aujourd'hui
    });
  }
},
    toggleSelection(cell) {
      if (!cell.isEmpty) {
        this.selectedDay = cell.day; // Stocke le jour sélectionné
        cell.isSelected = true;
        this.calendarCells.forEach((c) => {
          if (c.id !== cell.id) c.isSelected = false; // Désélectionne les autres jours
        });
      }
    },
    toggleSlotReservation(index) {
      if (this.isSlotReserved(index)) {
        // Si le créneau est déjà réservé, on l'annule
        this.reservedSlots = this.reservedSlots.filter((i) => i !== index);
      } else {
        // Sinon, on le réserve
        this.reservedSlots.push(index);
      }
    },
    isSlotDisabled(index) {
    // Vérifie si le créneau est dans le passé pour la date sélectionnée
    if (this.selectedDay) {
      const selectedDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDay);
      const currentDate = new Date();

      if (selectedDate.toDateString() === currentDate.toDateString()) {
        const slotTime = this.timeSlots[index].split(" - ")[0];
        return slotTime <= currentDate.toTimeString().slice(0, 5);
      }

      return selectedDate < currentDate.setHours(0, 0, 0, 0);
    }
    return false;
  },
  isSlotReserved(index) {
    // Vérifie uniquement si l'utilisateur a réservé le créneau
    return this.reservedSlots.includes(index);
  },
  toggleSlotReservation(index) {
    // Gérer la réservation et l'annulation d'un créneau
    if (this.isSlotReserved(index)) {
      // Annule la réservation
      this.reservedSlots = this.reservedSlots.filter((i) => i !== index);
    } else {
      // Réserve le créneau
      this.reservedSlots.push(index);
    }
  },
  
  submitReservations() {
  const token = localStorage.getItem('candidateToken'); // Récupérer le token depuis localStorage
  const candidateId = localStorage.getItem('candidateId'); // Récupérer l'ID du candidat depuis localStorage

  if (!token || !candidateId) {
    alert('Token ou ID de candidat manquant.');
    return;
  }

  // Créez un tableau de réservations, chaque réservation contenant un `candidate_id`, une `date`, et un `time_slot`
  const reservations = this.reservedSlots.map(index => ({
    candidate_id: candidateId,
    date: `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(this.selectedDay).padStart(2, '0')}`,
    time_slot: String(this.timeSlots[index]), // Chaque réservation a un créneau horaire distinct
  }));

  // Vérification dans la console du format des données
  console.log(reservations);

  // Envoi des réservations sous forme de tableau
  axios
    .post("http://localhost:8000/api/candidates/reservations", { reservations }, {
      headers: {
        'Authorization': `Bearer ${token}` // Ajouter le token dans les en-têtes
      }
    })
    .then((response) => {
      alert("Réservations envoyées avec succès !");
      this.selectedDay = null;
      this.reservedSlots = [];
    })
    .catch((error) => {
      console.error(error);
      alert("Une erreur est survenue lors de l'envoi des réservations.");
    });
}
  },
  mounted() {
    this.generateCalendar();
    // Vérifier si le token existe
    const token = localStorage.getItem("candidateToken");
    if (!token) {
      this.$router.push("/candidate-login"); // Rediriger vers la page de connexion si aucun token
    } else {
      // Récupérer le nom du candidat depuis localStorage
      this.candidateName = localStorage.getItem("candidateName");
    }
  },
};
</script>

<style scoped>
.reservation {
  padding: 10px;
  display: flex;
  gap: 100px;
  justify-content: start;
  align-items: start;
}

.calendar {
  width: 100%;
  margin: 50px;
  max-width: 500px;
  border: 1px solid #ccc;
  background: #fff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background: #9ecfff;
  color: #fff;
  font-weight: bold;
}
.calendar-header select {
  font-size: 14px;
  padding: 5px;
}
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f9f9f9;
  text-align: center;
  font-weight: bold;
}
.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.calendar-cell {
  text-align: center;
  padding: 5px;
  border: 1px solid #ddd;
  cursor: pointer;
}
.calendar-cell.empty {
  background: #f4f4f4;
  cursor: default;
}
.calendar-cell.selected {
  background: #9ecfff;
  color: #fff;
}
.calendar-cell.disabled {
  pointer-events: none; /* Empêche les clics */
  color: #ccc;
  background-color: #f5f5f5;
}

.time-slots {
  margin-top: 10px;
  width: 100%;
  max-width: 500px;
}
.time-slots table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
.time-slots th,
.time-slots td {
  padding: 5px;
  border: 1px solid #ddd;
  text-align: center;
}
.time-slots th{
  background-color: #9ecfff;
}
.time-slots td{
  background-color: #f9f9f9;
}
.time-slots button {
  padding: 5px 10px;
  background-color: #52a8ff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.time-slots button.reserved {
  background-color: #ff6f6f; /* Vert */
  color: white;
}

.time-slots button.disabled {
  background-color: #a1a1a1; /* Gris */
  color: #000000;
  cursor: not-allowed;
}


.submit-reservation {
  margin-top: 20px;
}

.submit-reservation button {
  padding: 5px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  bottom: 20px;
  left: 65%;
}

.submit-reservation button:hover {
  background-color: #218838;
}
</style>
