<template>
  <div class="overlay">
    <div class="pop-up" :class="{ claseConOverflow: showExtendEta }">
      <span>
        <transition name="fade">
          <ExtendEta
            :idProject="project.id"
            v-show="showExtendEta"
            @close="closeExtendEta" /></transition
      ></span>
      <button @click="closePopUp" class="btn btn-danger close-button">
        &times;
      </button>
      <h3>{{ project.project_code }}_{{ project.name }}</h3>
      <h5>{{ project.eta }}</h5>
      <hr />
      <button class="btn btn-outline-light" @click="openExtendEta()">
        Extender Eta
      </button>
      <div class="contenedor">
        <div
          v-for="(audit, index) in reversedAudited"
          :key="index"
          class="line"
        >
          <div class="box" :class="{ expanded: showInfo[index] }">
            <div class="inline-title" >
              <h5>{{ audit.title }}</h5>
              <button @click="expandBox(index)" class="btn btn-outline-light">▼</button>
            </div>
            <div v-if="showInfo[index]">
              <div class="inline-title">
                <h5>Usuario:</h5>
                <p>{{ audit.user_name }}</p>
              </div>
              <div class="col-md-12" v-html="formatAuditBody(audit)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import ExtendEta from "./extendEta.vue";

export default {
  name: "HistoryPopUp",
  props: ["idProject"],
  components: {
    ExtendEta,
  },
  data() {
    return {
      showExtendEta: false,
      showInfo: [],
    };
  },
  mounted() {
    window.addEventListener("keyup", this.handleKeyup);
    this.showInfo = new Array(this.reversedAudited.length).fill(false);
  },
  computed: {
    reversedAudited() {
      if (this.project.audited) {
        return this.project.audited.slice().reverse();
      }
      return [];
    },
  },
  methods: {
    openExtendEta() {
      this.showExtendEta = true;
      const popupElement = document.querySelector(".popup");
      if (popupElement) {
        popupElement.classList.add("claseConOverflow");
      }
    },
    closeExtendEta() {
      this.showExtendEta = false;
    },
    formatAuditBody(audit) {
      var auditBody;

      if (Object.keys(audit.changes).length === 0) {
        auditBody = "<p>No hubo cambios</p>";

        auditBody += '<div class="wrap-value">' + audit.comment + "</div>";
      } else {
        auditBody =
          '<table class="table table-dark table-hover">' +
          "<thead>" +
          "<tr>" +
          "<td>Atributo</td>" +
          "<td>Antigüo</td>" +
          "<td>Nuevo</td>" +
          "</tr>" +
          "</thead>" +
          "<tbody>";

        Object.keys(audit.changes).forEach(function (key) {
          var value = audit.changes[key];

          if (value !== null) {
            if (typeof value === "object") {
              auditBody +=
                "<tr>" +
                '<td class="td-wrap">' +
                key +
                "</td>" +
                '<td class="td-wrap">' +
                value[0] +
                "</td>" +
                '<td class="td-wrap">' +
                value[1] +
                "</td>" +
                "</tr>";
            } else {
              auditBody +=
                "<tr>" +
                '<td class="td-wrap">' +
                key +
                "</td>" +
                "<td></td>" +
                '<td class="td-wrap">' +
                value +
                "</td>" +
                "</tr>";
            }
          }
        });

        auditBody +=
          "</tbody></table>" +
          '<div class="wrap-value">' +
          audit.comment +
          "</div>";
      }
      return auditBody;
    },
    toggleShowInfo(index) {
      this.showInfo[index] = !this.showInfo[index];
    },
    handleKeyup(e) {
      if (e.key === "Escape" && this.showExtendEta == false) {
        this.closePopUp();
      }
    },
    expandBox(index) {
      this.toggleShowInfo(index);
    },
    closePopUp() {
      this.$emit("close");
      this.showInfo = [];
    },
    async fetchProject() {
      if (this.idProject) {
        await this.$store.dispatch("fetchProject", this.idProject);
      }
    },
  },
  watch: {
    idProject(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.fetchProject();
      }
    },
  },
  setup() {
    const store = useStore();
    const project = computed(() => store.state.project.project);

    return {
      project,
    };
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

.pop-up {
  padding: 2rem 3rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background-color: #141218;
  border-radius: 20px;
  border: 1px solid #f4641652;
  overflow: auto;
  min-width: 55vw;
  min-height: 60vh;
  max-width: 90vw;
  max-height: 80vh;
  box-sizing: border-box;
}
.box::-webkit-scrollbar,
.overlay::-webkit-scrollbar {
  width: 0;
}

.btn {
  margin: 5px;
}
.inline-title {
  align-content: center;
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.right-title {
  display: flex;
  flex-direction: column;
}

hr {
  border: none;
  border: 3px solid white;
  margin: 1em 0;
  padding: 0;
}

.contenedor {
  margin-top: 20px;
  width: 75%;
}

.line {
  margin-bottom: 20px;
  position: relative;
}

.line::before {
  content: "";
  position: absolute;
  width: 3px;
  height: 105%;
  background: #f46516;
  left: -10px;
  top: 10px;
}

.line::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f46516;
  left: -19px;
  top: 0px;
}

.box {
  cursor: pointer;
  margin-left: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: #18161d;
  border-top: 4px solid #f46516;
  border-bottom: 0.1px solid #ffffff0a;
  border-left: 0.1px solid #ffffff0a;
  border-right: 0.1px solid #ffffff0a;
  max-height: 100px;
  min-height: 80px;
  transition: max-height 0.5s ease;
  overflow: auto;
}

.box.expanded {
  overflow: auto;
  max-height: 250px;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 200ms ease-in-out;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}
.claseConOverflow {
  overflow: hidden;
}
</style>




