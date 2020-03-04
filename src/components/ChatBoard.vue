<template>
  <div>
    <v-tabs v-model="model" fixed-tabs>
      <v-tab href="#tab-1">タイムライン</v-tab>
      <v-tab href="#tab-2">プロフィール</v-tab>
    </v-tabs>
    <v-tabs-items v-model="model">
      <v-tab-item value="tab-1">
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-list three-line class="mb-6">
              <template v-for="(comment, index) in comments">
                <v-list-item :key="index" avatar>
                  <v-list-item-avatar>
                    <!-- <img :src="returnAvatar(comment.tweeterUid)" /> -->
                    <!-- <img :src="this.avatar" /> -->
                    <img :src="comment.avatar" />
                  </v-list-item-avatar>

                  <v-list-item-content class="mb-0">
                    <v-list-item-title class="title">{{
                      comment.tweeter
                    }}</v-list-item-title>
                    <v-list-item-subtitle class="text--primary subtitle-1">
                      {{ comment.content }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ comment.createdAt.toDate().toLocaleString() }}
                    </v-list-item-subtitle>
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
              <ChatForm />
            </v-list>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <v-alert
          v-model="alert.isDisplay"
          :type="alert.type"
          dismissible
          border="left"
          elevation="2"
          colored-border
          transition="scroll-y-transition"
          class="ma-2 mx-auto"
          max-width="434"
          >{{ alert.message }}</v-alert
        >
        <v-card class="mx-auto ma-2" max-width="434" tile>
          <v-img
            height="100%"
            src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
          >
            <v-row align="end" class="fill-height">
              <v-col align-self="start" class="pa-0" cols="12">
                <v-avatar class="profile" color="grey" size="164" tile>
                  <v-img :src="this.currentUser.photoURL"></v-img>
                </v-avatar>
              </v-col>
              <v-col class="py-0">
                <v-list-item color="rgba(0, 0, 0, .4)" dark>
                  <v-list-item-content>
                    <v-list-item-title class="title">{{
                      this.currentUser.displayName
                    }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      this.currentUser.email
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
        <Signout />
        <div class="text-center">
          <v-btn class="ma-2" outlined color="indigo" @click="changeImage"
            >プロフィール画像変更</v-btn
          >
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
export default {
  name: "ChatBoard",
  components: {
    Signout,
    ChatForm
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
    }
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
  },
  computed: {}
};
</script>
