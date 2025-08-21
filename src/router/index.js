import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

// Layout
import DefaultLayout from "@/layouts/DefaultLayout.vue";

// Pages
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Member from "@/pages/Members.vue";
import Category from "@/pages/Categories.vue";
import Budget from "@/pages/Budgets.vue";

const routes = [
  {
    path: "/login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: "/",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/dashboard" },
      {
        path: "dashboard",
        component: Dashboard,
        meta: { breadcrumb: "Dashboard" },
      },
      {
        path: "members",
        component: Member,
        meta: { breadcrumb: "Members" },
      },
      {
        path: "categories",
        component: Category,
        meta: { breadcrumb: "Categories" },
      },
      {
        path: "budgets",
        component: Budget,
        meta: { breadcrumb: "Budgets" },
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔒 Route Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) {
    return next("/login");
  }

  if (to.meta.guestOnly && auth.token) {
    return next("/dashboard");
  }

  next();
});
