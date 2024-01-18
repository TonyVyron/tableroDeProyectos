import axios from 'axios'
import Cookies from 'js-cookie';

const createApi = (id) => {
	const token = Cookies.get('thoth_token');

	if (!token) {
		console.log('La cookie "thoth_token" no están presente.');
		return;
	}

	return axios.create({
		baseURL: `http://localhost:3000/api/v1/projects/${id}`,
		headers: {
			Authorization: token ? token : null,
			withCredentials: true,
		},
	});
};

const project = {
	state: {
		project: [],
	},
	mutations: {
		setProject(state, project) {
			state.project = project
		}
	},
	actions: {
		async fetchProject({ commit }, id) {
			try {
				const api = createApi(id);
				const response = await api.get();
				commit('setProject', response.data['project'])
			} catch (error) {
				console.log("Error en el Fecth de datos");
			}
		},
		async updateProject({ commit }, putProject) {
			try {
				const api = createApi(putProject.id);
				const response = await api.put('', putProject.data);
				commit('setProject', response.data['project']);
			}
			catch (error) {
				console.log("Error al actualizar los datos");
			}
		},
	},
	getters: {
		projectCount(state) {
			return state.project.length
		}
	},
};

export default project


