<template>
  <v-card
    v-if="comment"
    class="mx-auto mb-2 chatboard-comment"
    color="teal accent-4"
    dark
    max-width="400"
  >
    <!-- {{likes}} -->
    <v-card-title class="px-0 py-2">
      <v-list-item>
        <CommentHeader :uid="comment.tweeterUid" :key="comment.id" />

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
            <!-- <v-list-item>
              <v-list-item-title>{{comment.id}}</v-list-item-title>
            </v-list-item>-->
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
          <v-icon class="mr-1" @click="likeComment()" :color="heartColor">mdi-heart</v-icon>
          <span class="subheading mr-2" :class="heartCountColor">{{ likes.length }}</span>
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
  data: () => ({
    likes: [],
    my_like: [],
    heartColor: "white",
    heartCountColor: "white--text"
  }),
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
    likeComment() {
      let user_uid = firebase.auth().currentUser.uid;
      const self = this;

      // let isIncludeLike = this.likes.some(like => like.user_id === user_uid);
      let index = this.likes.find(like => like.user_id === user_uid);

      if (index) {
        // console.log("index=true", index);
        self.heartColor = "white";
        self.heartCountColor = "white--text";

        db.collection("likes")
          .doc(index.id)
          .delete()
          .then(function() {
            // console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
      } else {
        // console.log("index=false", index);
        self.heartColor = "pink";
        self.heartCountColor = "pink--text text--darken-3";

        db.collection("likes")
          .add({
            user_id: user_uid,
            comment_id: this.comment.id
          })
          .then(function() {
            // console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      }
    },
    changeHeartColor() {
      let user_uid = firebase.auth().currentUser.uid;
      let isIncludeLike = this.likes.some(like => like.user_id === user_uid);
      // console.log("created:", this.likes);
      if (isIncludeLike) {
        this.heartColor = "pink";
        this.heartCountColor = "pink--text text--darken-3";
      }
    }
  },
  watch: {
    likes: function() {
      this.changeHeartColor();
    }
  },
  firestore() {
    let user_uid = firebase.auth().currentUser.uid;
    // let like = db
    //   .collection("likes")
    //   .where("comment_id", "==", this.comment.id);

    // let my_like = db
    //   .collection("likes")
    //   .where("comment_id", "==", this.comment.id)
    //   .where("user_id", "==", user_uid);
    // .get()
    // .then(function(doc) {
    //   if (doc.exists) {
    //     // self.userData = doc.data();
    //     self.like = true;
    //     console.log(doc.data(), self.like);
    //   } else {
    //     // doc.data() will be undefined in this case
    //     alert("No such document!");
    //   }
    // })
    // .catch(function(error) {
    //   alert("Error getting documents: " + error);
    // });

    return {
      likes: db.collection("likes").where("comment_id", "==", this.comment.id),

      my_like: db
        .collection("likes")
        .where("comment_id", "==", this.comment.id)
        .where("user_id", "==", user_uid)
    };
  }
};
</script>