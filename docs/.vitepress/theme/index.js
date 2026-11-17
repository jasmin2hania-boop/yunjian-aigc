import Layout from './Layout.vue';
import PerformanceSequence from './PerformanceSequence.vue';
import './style.css';
import './production.css';
import './editorial.css';

export default {Layout,enhanceApp({app}){app.component('PerformanceSequence',PerformanceSequence);}};
