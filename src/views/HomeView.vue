<template lang="">
    <div style="font-family:Blippo, fantasy" class="d-flex flex-column align-items-center text-dark">
        <h1 class="mt-5 p-3 rounded shadow">Driving School</h1>
        <div style="width : 800px; margin-top : 80px" class="d-flex justify-content-around">
            <router-link to="/login-candidate" class="d-flex flex-column align-items-center gap-2 p-2 rounded shadow"><img class="bg-danger p-2 rounded-circle border" src="../assets/icons8-personne-homme-48.png" width="120" alt=""><h4>Login</h4></router-link>
            <router-link to="/candidate/courses" class="d-flex flex-column align-items-center gap-2 p-2 rounded shadow"><img style="background-color:#F26B0F;" class="p-2 rounded-circle border" src="../assets/icons8-inscription-48.png" width="120" alt=""><h4>Cours</h4></router-link>
            <router-link to="/candidate/reservation" class="d-flex flex-column align-items-center gap-2 p-2 rounded shadow"><img class="bg-success p-2 rounded-circle border" src="../assets/icons8-support-en-ligne-48.png" width="120" alt=""><h4>Réservation</h4></router-link>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
    div a{
        height: 170px;
        width: 150px;
        color: rgb(0, 0, 0);
        background-color: rgba(255, 255, 255, 0.3);
        text-decoration: none;
        transition: all 0.5s;
    }
    div a:hover{
        height: 175px;
        color: rgba(0, 0, 0, 0.7);
        background-color: rgba(255, 255, 255, 0.7);
    }
</style>