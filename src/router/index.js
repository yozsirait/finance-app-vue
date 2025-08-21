import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

// Layout
import DefaultLayout from "@/layouts/DefaultLayout.vue";

// Pages
import Login from "@/pages/Login.vue";
import Dashboard from "@/pages/Dashboard.vue";
// import Members from "@/pages/Members.vue";
// import Accounts from "@/pages/Accounts.vue";
// import Categories from "@/pages/Categories.vue";
// import Budgets from "@/pages/Budgets.vue";
// import Transactions from "@/pages/Transactions.vue";
// import Reports from "@/pages/Reports.vue";
// import Profile from "@/pages/Profile.vue";
// import SavingTargets from "@/pages/SavingTargets.vue";

const routes = [
  {
    path: "/login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/dashboard" },
      { path: "dashboard", component: Dashboard },
    //   { path: "members", component: Members },
    //   { path: "accounts", component: Accounts },
    //   { path: "categories", component: Categories },
    //   { path: "budgets", component: Budgets },
    //   { path: "transactions", component: Transactions },
    //   { path: "reports", component: Reports },
    //   { path: "saving-targets", component: SavingTargets },
    //   { path: "profile", component: Profile },
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

  // Jika butuh login tapi belum login
  if (to.meta.requiresAuth && !auth.token) {
    return next("/login");
  }

  // Jika sudah login tapi masuk ke /login
  if (to.meta.guestOnly && auth.token) {
    return next("/dashboard");
  }

  next();
});
