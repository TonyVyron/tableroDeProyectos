<template>
  <div class="dark-overlay">
  <div class="pop-up2">
    <form @submit.prevent="submitForm" class="form-container">
      <h4>Extender ETA</h4>
      <div class="form-group" >
        <label for="newDate">Nueva Fecha:</label>
        <input
          class="form-control"
          type="date"
          id="newDate"
          v-model="newDate"
        />
      </div>
      <div class="form-group">
        <label for="comment">Comentario:</label>
        <textarea
          class="form-control"
          id="comment"
          v-model="comment"
          rows="4"
        ></textarea>
      </div>
      <br />
      <div class="button-container">
        <button type="submit" class="btn btn-outline-light btn-long">Guardar</button>
        <button @click="closeModal" class="btn btn-outline-danger btn-long">Cerrar</button>
      </div>
    </form>
  </div>
</div>
</template>

<script>

export default {
  name: "extendEta",
  props: ["idProject"],
  data() {
    return {
      newDate: "",
      comment: "",
    };
  },
  methods: {
    async updateEtaProject(idProject, newEta,comment) {
      const data = {
        project: {
          eta: newEta,
          audit_comment:comment
        },
      };
      await this.$store.dispatch("updateProject", { id: idProject, data });
    },
    submitForm() {
      if (this.newDate && this.comment) {
        this.updateEtaProject(this.idProject, this.newDate, this.comment);
        this.$emit("close");
      }
    },
    closeModal() {
      this.newDate = "";
      this.comment = "";
      this.$emit("close");
    },
  },
};
</script>

<style>

.dark-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(41, 41, 41, 0.5); 
  z-index: 999; 
}
.pop-up2 {
  padding: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  height: 40vh;
  width: 90vh;
  background-color: #141218;
  border-radius: 20px;
  border: 1px solid #f4641652;
  overflow: auto;
}
.button-container {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-long {
  width: 100px;
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
