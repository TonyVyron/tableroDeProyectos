<template>
      <header>
            <nav class="navbar navbar-expand-lg custom-navbar">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">
              <img :src="logoScisa" alt="Logo de SCISA" class="navbar-logo" />
            </a>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav">
                  <li class="nav-item">
                  <a class="nav-link" @click="redirectToSIA">Proyectos</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link"  @click="redirectToSIA">Regresar</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </template>
    

<script>
import { ref } from "vue";
import logoScisa from "@/assets/icons/logotipo_scisa 1.png";

export default {
  name: "HeaderSection",
  methods: {
    redirectToSIA() {
      window.location.href = "http://localhost:9000/#!/app/projects/list";
    },
  },
  setup() {
    const logoScisaRef = ref(logoScisa);


    return {
      logoScisa: logoScisaRef,
    };
  },
};
</script>

<style scoped>
.navbar-logo {
  max-height: 40px; /* Ajusta la altura máxima según tus necesidades */
}
.navbar {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  background-color: #ffffff10;
  backdrop-filter: blur(4px); 
  overflow: hidden;
}

.navbar a {
  color: white;
  padding: 2px;
  margin-right: 9vh;
  text-decoration: none;
}
.navbar img {
  padding: 0px 10px 0px 10px;
}

.navbar a:hover {
  background-color: rgba(0, 0, 0, 0.219);
}

.navbar a.active {
  background-color: rgba(0, 0, 0, 0.219);
}
.nav-item{
  cursor:pointer;
}
</style>
    