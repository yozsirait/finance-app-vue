import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "@/store/auth";
import "./style.css";
import { useDark, useToggle } from '@vueuse/core'

const app = createApp(App);
app.use(createPinia());
app.use(router);

// Setup dark mode globally
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light'
})

app.config.globalProperties.$isDark = isDark
app.config.globalProperties.$toggleDark = useToggle(isDark)

const auth = useAuthStore();
// kalau ada token di localStorage, coba fetch user langsung
if (auth.token) {
  auth.fetchUser();
}

app.mount("#app");
