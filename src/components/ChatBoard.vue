<template>
  <div>
    <v-tabs v-model="model" fixed-tabs color="indigo">
      <v-tab href="#tab-1">タイムライン</v-tab>
      <v-tab href="#tab-2">プロフィール</v-tab>
    </v-tabs>
    <v-tabs-items v-model="model">
      <v-tab-item value="tab-1">
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-list class="mb-6">
              <template v-for="(comment, index) in comments">
                <v-card
                  class="mx-auto mb-2 chatboard-comment"
                  :key="index"
                  color="indigo lighten-2"
                  dark
                  max-width="400"
                  transition="fade-transition"
                >
                  <v-card-title class="px-0 pt-2">
                    <v-list-item>
                      <!-- <v-badge
                        color="deep-purple accent-4"
                        overlap
                        icon="mdi-lock"
                        offset-x="25"
                        offset-y="25"
                        :value="messages"
                      >-->
                      <v-list-item-avatar color="grey darken-3">
                        <v-img class :src="comment.avatar"></v-img>
                      </v-list-item-avatar>
                      <!-- </v-badge> -->
                      <v-list-item-content>
                        <v-list-item-title>{{comment.tweeterName}}</v-list-item-title>
                      </v-list-item-content>
                      <v-spacer></v-spacer>

                      <v-menu bottom left>
                        <template v-slot:activator="{ on }">
                          <v-btn dark icon v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>

                        <v-list class="py-0" transition="scroll-y-transition">
                          <v-list-item @click="deleteComment(comment.id)">
                            <v-list-item-title class="subtile-1">削除</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item>
                  </v-card-title>

                  <v-card-text class="headline font-weight-bold mx-2 my-0">{{comment.content}}</v-card-text>

                  <v-card-actions>
                    <v-list-item class="grow">
                      <v-list-item-content>
                        <v-list-item-title
                          class=".overline"
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
              <ChatForm />
            </v-list>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <v-snackbar v-model="alert.isDisplay" top absolute :color="alert.type">{{ alert.message }}</v-snackbar>
        <v-card class="mx-auto ma-2" max-width="434" tile>
          <v-img height="100%" src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg">
            <v-row align="end" class="fill-height">
              <v-col align-self="start" class="pa-0" cols="12">
                <v-avatar class="profile" color="grey" size="164" tile>
                  <v-img :src="this.currentUser.photoURL"></v-img>
                </v-avatar>
              </v-col>
              <v-col class="py-0">
                <v-list-item color="rgba(0, 0, 0, .4)" dark>
                  <v-list-item-content>
                    <v-list-item-title class="title">
                      {{
                      this.currentUser.displayName
                      }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{
                      this.currentUser.email
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
        <Signout />
        <DeleteUser />
        <div class="text-center">
          <v-btn class="ma-2" outlined color="indigo" @click="changeImage">プロフィール画像変更</v-btn>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// import Vue from "vue";
import { db } from "../plugins/firebase";
import firebase from "firebase";
import ChatForm from "@/components/Form.vue";
import Signout from "@/components/Signout.vue";
import DeleteUser from "@/components/DeleteUser.vue";
export default {
  name: "ChatBoard",
  components: {
    Signout,
    ChatForm,
    DeleteUser
  },
  data: () => ({
    comments: [],
    model: "tab-1",
    currentUser: null,
    avatar: "",
    alert: {
      isDisplay: false,
      type: "",
      message: ""
    },
    messages: true
  }),
  firestore() {
    let comments = db.collection("comments").orderBy("createdAt");
    // console.log(comments[0]);
    return {
      // firestoreのcommentsコレクションを参照
      // comments: db.collection("comments").orderBy("likes")
      comments: comments
    };
  },
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
    },
    returnAvatar(uid) {
      db.collection("usersCollection")
        .doc(uid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            console.log(doc.data().photoURL);
            this.avatar = doc.data().photoURL;
          } else {
            // doc.data() will be undefined in this case
            alert("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    },
    changeImage() {
      let user = firebase.auth().currentUser;
      let photoURL =
        "https://i.picsum.photos/id/" +
        (Math.floor(Math.random() * 1083) + 1) +
        "/200/200.jpg";
      let self = this;
      user
        .updateProfile({
          photoURL: photoURL
        })
        .then(function() {
          // Update successful.
          db.collection("usersCollection")
            .doc(user.uid)
            .set({
              photoURL: photoURL
            })
            .then(() => {
              self.alert = {
                isDisplay: true,
                type: "success",
                message: "変更しました。"
              };
            })
            .catch(error => {
              alert(error.message);
            });
        })
        .catch(function(error) {
          alert("change-image" + error);
        });
    }
  },
  created() {
    this.currentUser = firebase.auth().currentUser;
    // console.log("ChatBoard: ", this.currentUser);
  },
  computed: {}
};
</script>
