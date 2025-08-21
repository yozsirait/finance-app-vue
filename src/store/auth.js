import { defineStore } from "pinia";
import api from "@/utils/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    // LOGIN
    async login(email, password) {
      try {
        const { data } = await api.post("/api/login", { email, password });

        // response: { success: true, data: { token: "..." } }
        this.token = data.data.token;
        localStorage.setItem("token", this.token);

        await this.fetchUser();
        return true;
      } catch (err) {
        console.error("Login failed:", err);
        return false;
      }
    },

    // REGISTER
    async register(name, email, password) {
      try {
        const { data } = await api.post("/api/register", {
          name,
          email,
          password,
        });

        // biasanya backend langsung balikin token juga
        if (data.data?.token) {
          this.token = data.data.token;
          localStorage.setItem("token", this.token);
          await this.fetchUser();
        }

        return true;
      } catch (err) {
        console.error("Register failed:", err);
        return false;
      }
    },

    // FETCH USER
    async fetchUser() {
      if (!this.token) return;
      try {
        const { data } = await api.get("/api/user", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = data.data ?? data; // fallback kalau wrapper beda
      } catch (err) {
        console.error("Fetch user failed:", err);
        this.logout();
      }
    },

    // LOGOUT
    async logout() {
      try {
        await api.post(
          "/api/logout",
          {},
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
      } catch (err) {
        console.warn("Logout request failed, clearing local state anyway.");
      }
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
