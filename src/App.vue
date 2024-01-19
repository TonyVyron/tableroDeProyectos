<template>
  <div id="app">
    <Header></Header>
    <transition name="fade">
      <History
        v-show="showHistory"
        :idProject="projectSeleccionado"
        @close="closeHistory"
    /></transition>
    <span><ErrorToken v-show="showError" /></span>
    <div class="centrar">
      <div class="board">
        <div class="priorities">
          <div class="priority">
            <div class="color-box priority-one"></div>
            <div>Muy prioritario</div>
          </div>
          <div class="priority">
            <div class="color-box priority-two"></div>
            <div>Prioritario</div>
          </div>
          <div class="priority">
            <div class="color-box priority-three"></div>
            <div>Moderado</div>
          </div>
          <div class="priority">
            <div class="color-box priority-four"></div>
            <div>Menos prioritario</div>
          </div>
        </div>
        <div class="projects">
          <div
            v-for="(projects, status) in {
              todo: todoProjects,
              inProgress: inProgressProjects,
              done: doneProjects.slice(0, 5),
            }"
            :key="status"
            class="cardiv"
          >
            <h3 class="lane-title">
              {{ statusTitle(status) }}
            </h3>
            <div class="centerdiv">
              <VueDraggable :ref="`${status}Draggable`" :v-model="projects">
                <Card
                  v-for="item in projects"
                  :key="item.id"
                  :class="getPriorityClass(item)"
                >
                  <div class="inline">
                    <h6>"{{ item.project_code }}_{{ item.name }}"</h6>
                    <div class="inlineRight">
                      <button
                        class="btn btn-outline-light right"
                        v-tooltip.top="item.project_type_catalog_name"
                      >
                        {{ typeOfProjects(item.project_type_catalog_name) }}
                      </button>
                      <div class="dropdown dropdown-float">
                        <button
                          class="btn btn-outline-light rightPriority"
                          type="button"
                          id="priorityDropdown"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {{ typeOfPriority(item.priority) }}
                        </button>
                        <div
                          class="dropdown-menu"
                          aria-labelledby="priorityDropdown"
                        >
                          <a
                            class="dropdown-item"
                            @click="updatePriorityProject(item.id, 0)"
                            >Muy prioritario</a
                          >
                          <a
                            class="dropdown-item"
                            @click="updatePriorityProject(item.id, 1)"
                            >Prioritario</a
                          >
                          <a
                            class="dropdown-item"
                            @click="updatePriorityProject(item.id, 2)"
                            >Moderado</a
                          >
                          <a
                            class="dropdown-item"
                            @click="updatePriorityProject(item.id, 3)"
                            >Menos prioritario</a
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>ETA: {{ item.eta }}</p>
                  <div class="inline">
                    <p>RAPE: {{ item.rape["name"] }}</p>
                    <div class="redonder">
                      <button
                        class="btn btn-outline-light"
                        @click="openHistory(item.id)"
                      >
                        Historial
                      </button>
                    </div>
                  </div>
                </Card>
              </VueDraggable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Card from "./components/Card.vue";
import ErrorToken from "./components/errorToken.vue";
import Header from "./components/Header.vue";
import History from "./components/History.vue";
import { VueDraggable } from "vue-draggable-plus";
import { ref, computed, watch } from "vue";
import Cookies from "js-cookie";
import { useStore } from "vuex";

export default {
  name: "App",
  components: {
    Card,
    VueDraggable,
    History,
    ErrorToken,
    Header,
  },
  data() {
    return {
      showHistory: false,
      showError: false,
      projectSeleccionado: null,
    };
  },
  methods: {
    openHistory(project) {
      this.$emit("open-history", project);
      this.projectSeleccionado = project;
      this.showHistory = true;
    },
    closeHistory() {
      this.$emit("close");
      this.showHistory = false;
    },
    checkError() {
      const token = Cookies.get("thoth_token");
      const ApiUser = Cookies.get("apiUser");
      if (!token || !ApiUser) {
        this.showError = true;
      } else {
        this.showError = false;
      }
    },
    async fetchProjects() {
      await this.$store.dispatch("fetchProjects");
    },
    async updatePriorityProject(idProject, numberPriority) {
      const data = {
        project: {
          priority: numberPriority,
        },
      };
      await this.$store.dispatch("updatePriorityProject", {
        id: idProject,
        data,
      });
      await this.fetchProjects();
    },
    getPriorityClass(item) {
      const priorities = {
        vip: "priority-one",
        plan: "priority-two",
        entrust: "priority-three",
        avoid: "priority-four",
      };
      return priorities[item.priority] || "";
    },
    typeOfPriority(statusName) {
      const types = {
        vip: "1",
        plan: "2",
        entrust: "3",
        avoid: "4",
      };
      return types[statusName] || "";
    },
    priorityTooltip(statusName) {
      const types = {
        vip: "Muy prioritario",
        plan: "Prioritario",
        entrust: "Moderado",
        avoid: "Menos Prioritario",
      };
      return types[statusName] || "";
    },
    typeOfProjects(statusName) {
      const types = {
        "Cliente con Factura": "CCF",
        "Cliente Facturado": "CF",
        "Intercambio de Recurso Asignado": "IRA",
        "Proyecto Cancelado": "PC",
        "Proyecto Interno": "PI",
        "Proyecto Sin Cobro": "PSC",
        "Recurso Asignado": "RA",
        Soporte: "S",
      };
      return types[statusName] || "";
    },
    statusTitle(status) {
      const titles = {
        todo: "Por hacer",
        inProgress: "En Progreso",
        done: "Terminado",
      };
      return titles[status] || "";
    },
  },
  created() {
    this.fetchProjects();
    this.checkError();
  },
  setup() {
    const store = useStore();
    const projects = computed(() => store.state.projects.projects);
    const todoProjects = ref([]);
    const inProgressProjects = ref([]);
    const doneProjects = ref([]);

    watch(projects, () => {
      todoProjects.value = filterProjects([
        "Requerimiento",
        "Propuesta",
        "Autorización del Cliente",
      ]);
      inProgressProjects.value = filterProjects(["En Desarrollo"]);
      doneProjects.value = filterProjects([
        "No Autorizado",
        "Cancelado",
        "Terminado",
      ]);
    });

    function filterProjects(states) {
      const filteredProjects = projects.value.filter((item) =>
        states.includes(item.state)
      );

      const sortedProjects = filteredProjects.sort((a, b) => {
        const priorityOrder = ["vip", "plan", "entrust", "avoid"];
        const priorityA = priorityOrder.indexOf(a.priority);
        const priorityB = priorityOrder.indexOf(b.priority);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        } else {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA;
        }
      });
      return sortedProjects;
    }

    return {
      todoProjects,
      inProgressProjects,
      doneProjects,
    };
  },
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.css";
body {
  background-image: url("assets/icons/Board-Version3.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #141218;
}

* {
  color: white;
}
.centrar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 93vh;
}

.board {
  padding: 0.8rem 0.8rem 1.2rem 1.2rem;
  min-width: 78vw;
  max-width: 78vw;
  max-height: 90vh;
  backdrop-filter: blur(4px);
  border-radius: 0.5rem;
  overflow: auto;
  background-color: #ffffff10;
}
.projects {
  display: flex;
  justify-content: center;
  justify-content: space-between;
}

.priorities {
  margin-right: 0.5rem;
  display: flex;
  overflow: auto;
  justify-content: right;
}

.priority {
  margin: 5px;
  display: flex;
  align-items: center;
}

.color-box {
  margin: 5px;
  width: 20px;
  height: 20px;
}
.cardiv {
  padding: 0.5rem;
  margin-right: 0.8rem;
  border-radius: 0.5rem;
  background-color: #1d1a21;
  width: 100%;
  height: 78vh;
}

.centerdiv {
  display: flex;
  height: 67vh;
  justify-content: center;
  overflow: auto;
}
.centerdiv::-webkit-scrollbar {
  width: 0;
}
.lane-title {
  padding: 0.5rem;
}

.priority-one {
  background-color: #22070d;
}

.priority-two {
  background-color: #3b264d;
}

.priority-three {
  background-color: #26304d;
}

.priority-four {
  background-color: #26454d;
}

.inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.inlineRight {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  padding: 0.3rem 0.8rem 0.3rem 0.8rem;
  font-size: 14px;
}
.right {
  background-color: #1f3e30;
  font-weight: bold;
  margin-right: 2px;
  padding: 0.1rem 0.8rem 0.1rem 0.8rem;
}
.rightPriority {
  font-weight: bold;
  padding: 0.1rem 0.8rem 0.1rem 0.8rem;
}
.card h6 {
  margin: 3px;
  color: white;
}
.card p {
  margin: 3px;
  font-size: 14px;
}
.card:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  transition: box-shadow 0.3s;
}
@media only screen and (max-width: 768px) {
  .priorities {
    justify-content: flex-start;
    overflow: auto;
  }
}
</style>
