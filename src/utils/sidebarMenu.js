import {
  LayoutDashboard,
  Users,
  Wallet,
  FolderTree,
//   ArrowsLeftRight,
  Target,
  BarChart3,
  User
} from "lucide-vue-next";

export const sidebarMenu = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    label: "Members",
    icon: Users,
    to: "/members",
  },
//   {
//     label: "Accounts",
//     icon: Wallet,
//     children: [
//       { label: "Accounts", to: "/accounts" },
//       { label: "Account Types", to: "/accounts/types" }
//     ]
//   },
//   {
//     label: "Categories & Budgets",
//     icon: FolderTree,
//     children: [
//       { label: "Categories", to: "/categories" },
//       { label: "Budgets", to: "/budgets" }
//     ]
//   },
//   {
//     label: "Transactions",
//     icon: ArrowsLeftRight,
//     children: [
//       { label: "Transactions", to: "/transactions" },
//       { label: "Recurring", to: "/recurring-transactions" },
//       { label: "Transfers", to: "/transfers" }
//     ]
//   },
//   {
//     label: "Saving Goals",
//     icon: Target,
//     to: "/saving-targets",
//   },
//   {
//     label: "Reports",
//     icon: BarChart3,
//     children: [
//       { label: "Transactions", to: "/reports/transactions" },
//       { label: "Summary", to: "/reports/summary" },
//       { label: "Budgets", to: "/reports/budget" },
//       { label: "Savings", to: "/reports/saving" },
//       { label: "Members Comparison", to: "/reports/members-comparison" },
//       { label: "Comparison Chart", to: "/reports/members-comparison-chart" },
//       { label: "Export CSV", to: "/reports/export/csv" },
//       { label: "Export PDF", to: "/reports/export/pdf" }
//     ]
//   },
//   {
//     label: "Profile",
//     icon: User,
//     children: [
//       { label: "My Account", to: "/user" },
//       { label: "Logout", to: "/logout" }
//     ]
//   }
];
