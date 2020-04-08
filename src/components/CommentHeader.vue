<template>
  <div>
    <router-link
      :to="'/user/'+ this.uid"
      class="router-link"
      style="display: flex; text-decoration: none; color: #fff;"
    >
      <v-list-item-avatar color="grey darken-3">
        <!-- <v-img class :src="returnAvatar(comment.tweeterUid)"></v-img> -->
        <v-img class v-if="user" :src="user.photoURL"></v-img>
        <v-img class v-else src="https://i.picsum.photos/id/10/20/20.jpg"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title
          class="text-truncate"
          v-if="user"
          style="max-width: 200px;"
        >{{user.displayName}}</v-list-item-title>
        <v-list-item-title v-else>Unknown</v-list-item-title>
      </v-list-item-content>
    </router-link>
  </div>
</template>

<script>
import { db } from "../plugins/firebase";

export default {
  name: "CommentHeader",
  data: () => ({
    user: null
  }),
  props: ["uid"],
  firestore() {
    // console.log(this.uid, "from CommentHeader");
    let user = db.collection("usersCollection").doc(this.uid);
    // console.log("firestore");
    return {
      user: user
    };
  },

  beforeRouteUpdate(to, from, next) {
    // `this` を使用
    // this.user = db.collection("usersCollection").doc($route.params.uid);
    console.log("beforeRouteUpdate");
    next();
  },
  watch: {
    $route(to, from) {
      console.log(to, from);
    }
  }
};
</script>
