<template>
  <v-list three-line class="mb-3">
    <v-tabs v-model="model">
      <v-tab href="#tab-1">タイムライン</v-tab>
      <v-tab href="#tab-2">設定</v-tab>
    </v-tabs>
    <v-tabs-items v-model="model">
      <v-tab-item value="tab-1">
        <template
          v-for="(comment, index) in comments"
          transition="slide-x-transition"
        >
          <v-list-item :key="index" avatar>
            <v-list-item-avatar>
              <img :src="comment.avatar" />
            </v-list-item-avatar>

            <v-list-item-content class="mb-0">
              <v-list-item-subtitle class="text--primary subtitle-1">{{
                comment.content
              }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{
                comment.createdAt.toDate().toLocaleString()
              }}</v-list-item-subtitle>
              <div class="d-flex flex-row">
                <v-col cols="6" class="mb-0">
                  <v-btn
                    text
                    icon
                    small
                    color="pink"
                    @click="likeComment(comment.id)"
                  >
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                  {{ comment.likes }}
                </v-col>
                <v-col cols="3" class="mb-0">
                  <v-btn text icon small color="green">
                    <v-icon>mdi-cached</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="3" class="mb-0">
                  <v-btn
                    text
                    icon
                    small
                    color="navy"
                    @click="deleteComment(comment.id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </div>
            </v-list-item-content>
            <v-list-item-action></v-list-item-action>
          </v-list-item>
          <v-divider :key="comment.id"></v-divider>
        </template>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <Signout />
      </v-tab-item>
    </v-tabs-items>
  </v-list>
</template>

<script>
import { db } from "../plugins/firebase";
import firebase from "firebase";
import Signout from "@/components/Signout.vue";
export default {
  name: "ChatBoard",
  components: {
    Signout
  },
  data: () => ({
    comments: [],
    model: "tab-1"
  }),
  firestore() {
    return {
      // firestoreのcommentsコレクションを参照
      // comments: db.collection("comments").orderBy("likes")
      comments: db.collection("comments").orderBy("createdAt")
    };
  },
  methods: {
    deleteComment(id) {
      if (!confirm("コメントを削除してよろしいですか？")) {
        return;
      }
      db.collection("comments")
        .doc(id)
        .delete();
    },
    likeComment(id) {
      db.collection("comments")
        .doc(id)
        .update({
          likes: firebase.firestore.FieldValue.increment(50)
        });
    },
    printNickname() {
      var user = firebase.auth().currentUser;
      if (user != null) {
        alert("Name:" + user.displayName);
      } else {
        alert("user is null");
      }
    }
  }
};
</script>
