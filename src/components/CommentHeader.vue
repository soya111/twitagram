<template>
  <div style="display: flex;">
    <router-link :to="'/user/'+ this.uid" class="router-link">
      <v-list-item-avatar color="grey darken-3">
        <!-- <v-img class :src="returnAvatar(comment.tweeterUid)"></v-img> -->
        <v-img class :src="user.photoURL"></v-img>
      </v-list-item-avatar>
    </router-link>
    <v-list-item-content>
      <v-list-item-title>{{user.displayName}}</v-list-item-title>
    </v-list-item-content>
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
    console.log(user);
    return {
      user: user
    };
  }
};
</script>
