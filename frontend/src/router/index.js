import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NewOsView from "@/views/NewOsView.vue";
import CustomerListView from "@/views/CustomerListView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    {
      path: "/new-os",
      name: "new-os",
      component: NewOsView,
    },

        {
      path: "/customer-list",
      name: "customer-list",
      component: CustomerListView,
    },
  ],
});

export default router;
