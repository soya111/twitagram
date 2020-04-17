<template>
  <div>
    <!-- uid: {{uid}}
    <br />
    comment_id:
    {{comment_id}}-->
    <Comment v-if="comment" :key="comment_id" :comment="comment" />

    <div></div>
    <!-- <div>{{likes}}</div> -->
    <v-card class="mx-auto" max-width="400" tile>
      <v-list color="teal accent-4">
        <v-subheader class="white--text">いいねした人 {{likes.length}}人</v-subheader>
        <v-list-item-group color="primary" v-if="likes.length!=0">
          <v-list-item v-for="like in likes" :key="like.user_id">
            <v-list-item-content>
              <v-list-item-title>
                <CommentHeader :uid="like.user_id" />
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group v-else>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="white--text">いいねした人はいません</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { db } from "../plugins/firebase";

import Comment from "@/components/Comment.vue";
import CommentHeader from "@/components/CommentHeader.vue";

export default {
  name: "CommentPage",
  components: {
    CommentHeader,
    Comment
  },
  data: () => ({
    likes: [],
    comment: null
  }),
  props: {
    uid: String,
    comment_id: String
  },
  firestore() {
    return {
      likes: db.collection("likes").where("comment_id", "==", this.comment_id),
      comment: db.collection("comments").doc(this.comment_id)
    };
  }
};
</script>