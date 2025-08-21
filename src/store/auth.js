import { defineStore } from "pinia";
import api from "@/utils/axios";
import { router } from "@/router"; // import router supaya bisa redirect langsung

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // LOGIN
    async login(email, password) {
      try {
        const { data } = await api.post("/api/login", { email, password });
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
        const { data } = await api.post("/api/register", { name, email, password });
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

        this.user = data.data ?? data;

        if (this.user?.ID) {
          localStorage.setItem("user_id", this.user.ID);
        }
      } catch (err) {
        console.error("Fetch user failed:", err);
        await this.logout();
      }
    },

    // LOGOUT
    async logout() {
      try {
        if (this.token) {
          await api.post("/api/logout", {}, {
            headers: { Authorization: `Bearer ${this.token}` },
          });
        }
      } catch (err) {
        console.warn("Logout request failed, clearing local state anyway.");
      }

      // Bersihkan state & storage
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");

      // Redirect ke login langsung
      router.replace("/login");
    },
  },
});
