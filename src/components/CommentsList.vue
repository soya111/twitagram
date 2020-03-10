<template>
  <div v-if="this.avatar">
    <template v-for="(comment, index) in comments">
      <v-card
        class="mx-auto my-2 chatboard-comment"
        :key="index"
        color="indigo lighten-2"
        dark
        max-width="400"
        transition="fade-transition"
      >
        <v-card-title class="px-0 pt-2">
          <v-list-item>
            <router-link :to="'/user/'+ comment.tweeterUid" class="router-link">
              <v-list-item-avatar color="grey darken-3">
                <v-img class :src="comment.avatar"></v-img>
              </v-list-item-avatar>
            </router-link>
            <v-list-item-content>
              <v-list-item-title>{{comment.tweeterName}}</v-list-item-title>
            </v-list-item-content>

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

        <v-card-text class="headline font-weight-bold mx-2 ml-0">{{comment.content}}</v-card-text>

        <v-card-actions>
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title class=".overline">{{ comment.createdAt.toDate().toLocaleString() }}</v-list-item-title>
            </v-list-item-content>
            <v-row align="center" justify="end">
              <v-icon class="mr-1" @click="likeComment(comment.id)">mdi-heart</v-icon>
              <span class="subheading mr-2">{{ comment.likes }}</span>
            </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </template>
  </div>
</template>

<script>
import { db } from "../plugins/firebase";
import firebase from "firebase";

export default {
  name: "CommentsList",
  props: ["uid"],
  data: () => ({ comments: [], avatar: null }),
  firestore() {
    let self = this;
    let comments = db
      .collection("comments")
      .where("tweeterUid", "==", this.uid);
    let avatar;
    db.collection("usersCollection")
      .doc(this.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          // console.log(self.avatar);
          //   console.log(doc.data().photoURL);
          avatar = doc.data().photoURL;
          self.avatar = doc.data().photoURL;
          // self.userData = doc.data();
        } else {
          // doc.data() will be undefined in this case
          alert("No such document!");
        }
      });
    return {
      // firestoreのcommentsコレクションを参照
      // comments: db.collection("comments").orderBy("likes")
      comments: comments,
      avatar: avatar
    };
  },
  methods: {
    deleteComment(id) {
      //   console.log(id);
      if (!confirm("コメントを削除してよろしいですか？")) {
        return;
      }
      db.collection("comments")
        .doc(id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error deleting document: ", error);
        });
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