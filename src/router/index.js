import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

// Layout
import DefaultLayout from "@/layouts/DefaultLayout.vue";

// Pages
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Member from "@/pages/Members.vue";
import Account from "@/pages/Accounts.vue";
import Category from "@/pages/Categories.vue";
import Budget from "@/pages/Budgets.vue";
import Transaction from "../pages/Transactions.vue";

const routes = [
  { path: "/login", component: Login, meta: { guestOnly: true } },
  { path: "/register", component: Register, meta: { guestOnly: true } },
  {
    path: "/",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/dashboard" },
      { path: "dashboard", component: Dashboard, meta: { breadcrumb: "Dashboard" } },
      { path: "members", component: Member, meta: { breadcrumb: "Members" } },
      { path: "accounts", component: Account, meta: { breadcrumb: "Accounts" } },
      { path: "categories", component: Category, meta: { breadcrumb: "Categories" } },
      { path: "budgets", component: Budget, meta: { breadcrumb: "Budgets" } },
      { path: "transactions", component: Transaction, meta: { breadcrumb: "Transactions" } },
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

  // tunggu Pinia siap (reactive) sebelum cek
  const token = auth.token;

  if (to.meta.requiresAuth && !token) return next("/login");
  if (to.meta.guestOnly && token) return next("/dashboard");
  
  next();
});
