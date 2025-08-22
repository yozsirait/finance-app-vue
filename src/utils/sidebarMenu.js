import {
  LayoutDashboard,
  Users,
  Wallet,
  Banknote,
  SquareMenu,
  FolderTree,
  ReceiptText,
  BadgeDollarSign,
  Target,
  BarChart3,
  User,
  DollarSign
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
  {
    label: "Accounts",
    icon: Wallet,
    to: "/accounts",
  },

  {
    label: "Categories & Budgets",
    icon: FolderTree,
    children: [
      { label: "Categories",icon: SquareMenu, to: "/categories" },
      { label: "Budgets",icon: Banknote, to: "/budgets" }
    ]
  },

    {
      label: "Transactions",
      icon: ReceiptText,
      children: [
        { label: "Transactions",icon: BadgeDollarSign, to: "/transactions" },
        { label: "Recurring", to: "/recurring-transactions" },
        { label: "Transfers", to: "/transfers" }
      ]
    },
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
  
];
