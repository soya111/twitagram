<template>
  <div id="app">
    <!-- App.vue -->
    <v-app>
      <v-navigation-drawer app v-model="drawer" color="teal accent-4" dark>
        <template v-slot:prepend>
          <v-list-item two-line>
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/women/81.jpg" />
              <!-- <img :src="user.photoURL" /> -->
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Jane Smith</v-list-item-title>
              <v-list-item-subtitle>Logged In</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-divider></v-divider>
        <v-list nav dense id="nav">
          <v-list-item-group active-class="indigo--text text--accent-4">
            <router-link v-for="item in drawerItems" :key="item.title" :to="item.link">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </router-link>
          </v-list-item-group>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn color="green" disabled block dark>Logout</v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar app color="teal" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="font-weight-black">Twitagram</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- Sizes your content based upon application components -->
      <v-content>
        <!-- Provides the application the proper gutter -->
        <v-container fluid>
          <!-- If using vue-router -->
          <router-view></router-view>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "./plugins/firebase";

export default {
  data: () => ({
    drawer: false,
    drawerItems: [
      { link: "/", title: "Home", icon: "mdi-home" },
      { link: "/signup", title: "ユーザー登録", icon: "mdi-account-plus" },
      { link: "/signin", title: "ログイン", icon: "mdi-account-arrow-left" }
    ],
    currentUser: null,
    url: "./assets/logo.png",
    user: null,
    uid: ""
  }),
  beforeCreate() {
    // this.currentUser = firebase.auth().currentUser;
    // let user = db.collection("usersCollection").doc(this.currentUser.uid);
    // return {
    //   user: user
    // };
    // console.log("App: ", this.currentUser);
  },
  firestore() {
    let currentUser = firebase.auth().currentUser;

    console.log(currentUser.uid);
    let user = db.collection("usersCollection").doc(this.currentUser.uid);
    console.log(user);
    return {
      user: user
    };
  }
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 20px 20px 0;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
