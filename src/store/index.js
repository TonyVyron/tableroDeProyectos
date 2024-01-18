import { createStore } from 'vuex';

// Función para importar dinámicamente los módulos
function importModules() {
  const modules = {};
  const context = require.context('./modules', false, /\.js$/);

  context.keys().forEach((key) => {
    const moduleName = key.replace(/^\.\/(.*)\.\w+$/, '$1');
    const moduleConfig = context(key);
    modules[moduleName] = moduleConfig.default || moduleConfig;
  });

  return modules;
}

// Configuración de la tienda
export default createStore({
  modules: importModules(),
});