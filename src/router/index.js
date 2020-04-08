import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import UserPage from "../views/UserPage";
import Signup from "@/components/Signup.vue";
import Signin from "@/components/Signin.vue";
import ChatBoard from "@/components/ChatBoard.vue";
import MyProfile from "@/components/MyProfile.vue";
import firebase from "firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/signin",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Timeline",
        component: ChatBoard,
      },
      {
        path: "Profile",
        name: "Profile",
        component: MyProfile,
      },
    ],
  },
  {
    path: "/user/:uid",
    name: "UserPage",
    component: UserPage,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  // ,
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next();
      } else {
        next({
          path: "signin",
          query: { redirect: to.fullPath },
        });
      }
    });
  } else {
    //   firebase.auth().onAuthStateChanged(user => {
    //     if (user) {
    //       next({ path: "/" });
    //     } else {
    next();
    //     }
    //   });
  }
});

export default router;
