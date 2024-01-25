import axios from 'axios';
import Cookies from 'js-cookie';

const api = () => { 
  const token = Cookies.get('thoth_token');
  const ApiUser = Cookies.get('apiUser');

  if (!token || !ApiUser) {
    console.log('Las cookies "thoth_token" o "apiUser" no están presentes.');
    return; 
  }

  const apiUserObject = ApiUser ? JSON.parse(ApiUser) : null;

  return axios.create({
    baseURL: 'http://localhost:3000/api/v1/projects',
    headers: {
      Authorization: token ? token : null,
      withCredentials: true,
    },
    params: {
      page: 'all',
      per_page: 'all',
      involved_projects_by_employee: apiUserObject['employee']['id']
    }
  });
};

const projects = {
  state: {
    projects: [],
  },
  mutations: {
    setProjects(state, projects) {
      state.projects = projects;
    }
  },
  actions: {
    async fetchProjects({ commit }) {
      try {
        const response = await api().get();
        commit('setProjects', response.data['projects']);
      } catch (error) {
        console.log("Error en el Fecth de datos");
      }
    }
  },
  getters: {
    projectsCount(state) {
      return state.projects.length;
    }
  },
};

export default projects;
