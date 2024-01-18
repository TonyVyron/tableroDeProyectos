import { createApp } from 'vue'
import App from './App.vue'
import 'primevue/resources/themes/saga-blue/theme.css'      
import 'primevue/resources/primevue.min.css'               
import 'primeicons/primeicons.css'                       
import Tooltip from 'primevue/tooltip';
import index from './store/index';

const app = createApp(App, {}, { isNativeTag: tag => tag === 'div' })
app.directive('tooltip', Tooltip)
app.use(index);
app.mount('#app')
