<template>
  <div class="overlay">
    <div class="pop-up">
      <div class="pi pi-times" style="font-size: 1.5rem" @click="closePopUp"></div>
      <div class="inline-title">
        <h3>{{ project.project_code }}_{{ project.name }}</h3> 
      </div>
      <hr />
      <div class="contenedor">
        <div
          v-for="(audit, index) in reversedAudited"
          :key="index"
          class="line"
        >
          <div
            class="box"
            @click="expandBox(index)"
            :class="{ expanded: showInfo[index] }"
          >
            <h5>{{ audit.title }}</h5>
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

export default {
  name: "HistoryPopUp",
  props: ["idProject"],
  data() {
    return {
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
    formatAuditBody(audit) {
      var auditBody;

      if (Object.keys(audit.changes).length === 0) {
        auditBody = '<p>No hubo cambios</p>';
      } else {
        auditBody =
          '<table class="table table-dark table-hover">' +
          '<thead>' +
          '<tr>' +
          '<td>Atributo</td>' +
          '<td>Antigüo</td>' +
          '<td>Nuevo</td>' +
          '</tr>' +
          '</thead>' +
          '<tbody>';

        Object.keys(audit.changes).forEach(function (key) {
          var value = audit.changes[key];

          if (value !== null) {
            if (typeof value === 'object') {
              auditBody +=
                '<tr>' +
                '<td class="td-wrap">' + key + '</td>' +
                '<td class="td-wrap">' + value[0] + '</td>' +
                '<td class="td-wrap">' + value[1] + '</td>' +
                '</tr>';
            } else {
              auditBody +=
                '<tr>' +
                '<td class="td-wrap">' + key + '</td>' +
                '<td></td>' +
                '<td class="td-wrap">' + value + '</td>' +
                '</tr>';
            }
          }
        });

        auditBody += '</tbody></table>' + '<div class="wrap-value">' + audit.comment + '</div>';
      }
      return auditBody;
    },
    toggleShowInfo(index) {
      this.showInfo[index] = !this.showInfo[index];
    },
    handleKeyup(e) {
      if (e.key === "Escape") {
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
  width: 100vw;
  height: 100vh;
  background: rgba(78, 78, 78, 0.404);
  z-index: 1;
}

.pop-up {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  padding: 2rem 4rem 120px;
  height: 70vh;
  width: 60vw;
  background-color: #141218;
  border-radius: 20px;
  border: 1px solid #f4641652;
  overflow: auto;
}

.btn {
  margin: 5px;
}
.inline-title {
  justify-content: space-between;
  display: flex;
  cursor: pointer;
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
  margin-top: 40px;
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
  transition: max-height 0.3s ease;
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

.pi{
  display: flex;
  justify-content: right;
  cursor: pointer;
}

@media only screen and (max-width: 768px) {
  .pi{
    justify-content: flex-start;
  }
}
</style>




