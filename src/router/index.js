import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/pages/Dashboard.vue";
import Members from "@/pages/Members.vue";
import Accounts from "@/pages/Accounts.vue";
import Categories from "@/pages/Categories.vue";
import Budgets from "@/pages/Budgets.vue";
import Transactions from "@/pages/Transactions.vue";
import Reports from "@/pages/Reports.vue";
import Profile from "@/pages/Profile.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: Dashboard },
  { path: "/members", component: Members },
  { path: "/accounts", component: Accounts },
  { path: "/categories", component: Categories },
  { path: "/budgets", component: Budgets },
  { path: "/transactions", component: Transactions },
  { path: "/reports", component: Reports },
  { path: "/profile", component: Profile },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
