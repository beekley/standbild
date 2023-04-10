import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// General styling.
import "./styles/bulma.scss";

const app = createApp(App);

app.use(router);
app.mount("#app");
