import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "@/store/auth";
import "./style.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);

const auth = useAuthStore();
// kalau ada token di localStorage, coba fetch user langsung
if (auth.token) {
  auth.fetchUser();
}

app.mount("#app");
