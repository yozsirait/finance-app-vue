import { defineStore } from "pinia";
import api from "@/utils/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const { data } = await api.post("/api/login", { email, password });
        this.token = data.token;
        localStorage.setItem("token", data.token);

        await this.fetchUser();
        return true;
      } catch (err) {
        console.error("Login failed:", err);
        return false;
      }
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        const { data } = await api.get("/api/user");
        this.user = data;
      } catch (err) {
        console.error("Fetch user failed:", err);
        this.logout();
      }
    },
    async logout() {
      try {
        await api.post("/api/logout");
      } catch (err) {
        console.warn("Logout request failed, clearing local state anyway.");
      }
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
