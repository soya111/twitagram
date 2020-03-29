<template>
  <div>
    <router-link
      :to="'/user/'+ this.uid"
      class="router-link"
      style="display: flex; text-decoration: none; color: #fff;"
    >
      <v-list-item-avatar color="grey darken-3">
        <!-- <v-img class :src="returnAvatar(comment.tweeterUid)"></v-img> -->
        <v-img class :src="user.photoURL"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-truncate" style="max-width: 200px;">{{user.displayName}}</v-list-item-title>
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
    return {
      user: user
    };
  }
};
</script>
