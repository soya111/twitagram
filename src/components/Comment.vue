<template>
  <v-card class="mx-auto mb-2 chatboard-comment" color="teal accent-4" dark max-width="400">
    <!-- {{comment.id}} -->
    <v-card-title class="px-0 py-2">
      <v-list-item>
        <CommentHeader :uid="comment.tweeterUid" />

        <v-spacer></v-spacer>

        <v-menu bottom left transition="scroll-x-transition">
          <template v-slot:activator="{ on }">
            <v-btn dark icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list class="py-0">
            <v-list-item disabled @click="deleteComment(comment.id)">
              <v-list-item-title class="subtile-1">削除</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
    </v-card-title>

    <v-card-text class="subtitle-1 font-weight-bold mx-2 my-0 py-0">{{comment.content}}</v-card-text>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-content>
          <v-list-item-title
            class="caption text-no-wrap"
          >{{ comment.createdAt.toDate().toLocaleString() }}</v-list-item-title>
        </v-list-item-content>

        <v-row align="center" justify="end">
          <v-icon class="mr-1" @click="likeComment(comment.id)">mdi-heart</v-icon>
          <span class="subheading mr-2">{{ comment.likes }}</span>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
import { db } from "../plugins/firebase";
import firebase from "firebase";

import CommentHeader from "@/components/CommentHeader.vue";

export default {
  name: "Comment",
  components: {
    CommentHeader
  },
  data: () => ({}),
  props: ["comment"],
  methods: {
    deleteComment(id) {
      // if (!confirm("コメントを削除してよろしいですか？")) {
      //   return;
      // }
      db.collection("comments")
        .doc(id)
        .delete();
    },
    likeComment(id) {
      db.collection("comments")
        .doc(id)
        .update({
          likes: firebase.firestore.FieldValue.increment(1)
        });
    }
  }
};
</script>