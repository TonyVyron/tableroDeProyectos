<template>
  <div class="overlay">
    <div class="card">
      <h3>Error de autenticación</h3>
      <button class="btn btn-danger" @click="redirectToSIA">
        <h5>Ir al SIA</h5>
      </button>
      <h5>Redirigiendo al SIA en {{ counter }} segundos</h5>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Cookies from "js-cookie";

export default {
  name: "errorView",
  setup() {
    const counter = ref(5);
    let intervalId = null;

    onMounted(() => {
      intervalId = setInterval(() => {
        if (counter.value > 0) {
          counter.value--;
        } else {
          const token = Cookies.get("thoth_token");
          const ApiUser = Cookies.get("apiUser");
          
          if (!token || !ApiUser) {
            window.location.href = "http://localhost:9000/#!/sign_in";
          }
          clearInterval(intervalId);
        }
      }, 950);
    });

    return {
      counter,
    };
  },
  methods: {
    redirectToSIA() {
      window.location.href = "http://localhost:9000/#!/sign_in";
    },
  },
};
</script>


<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(78, 78, 78, 0.404);
  z-index: 1;
}

.card {
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  height: 30%;
  width: 30%;
  background-color: #141218;
  color: white;
  overflow-y: auto;
  border-radius: 20px;
  border: 1px solid #f4641652;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 200ms ease-in-out;
}
</style>
