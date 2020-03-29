<template>
  <div>
    <v-snackbar v-model="alert.isDisplay" top absolute :color="alert.type">{{ alert.message }}</v-snackbar>
    <v-card class="mx-auto ma-2" max-width="434" tile>
      <v-img height="100%" :src="returnRandomImage_c">
        <v-row align="end" class="fill-height">
          <v-col align-self="start" class="pa-0" cols="12">
            <v-avatar class="profile" color="grey" size="164" tile>
              <v-img :src="this.currentUser.photoURL"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-0">
            <v-list-item color="rgba(0, 0, 0, .4)" dark>
              <v-list-item-content>
                <v-list-item-title class="title d-flex">
                  <div class="text-truncate">
                    {{
                    this.currentUser.displayName
                    }}
                  </div>
                  <v-fab-transition>
                    <v-btn color="transparent" dark x-small fab @click.stop="openDialog">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-fab-transition>
                  <v-dialog
                    v-model="dialog"
                    max-width="600px"
                    transition="scroll-y-reverse-transition"
                  >
                    <v-card>
                      <v-toolbar flat>
                        <v-btn icon @click="dialog = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>ユーザー名変更</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                          <v-btn text dark color="green" @click.stop="changeDisplayName">変更する</v-btn>
                        </v-toolbar-items>
                      </v-toolbar>
                      <v-container fluid>
                        <v-text-field prepend-icon="mdi-account" v-model="newDisplayName" clearable></v-text-field>
                      </v-container>
                    </v-card>
                  </v-dialog>
                </v-list-item-title>
                <v-list-item-subtitle @click="addSecretNum">
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
      <v-btn
        class="mt-2"
        outlined
        color="teal"
        @click="changeImage(returnRandomImage_m())"
      >プロフィール画像変更</v-btn>
    </div>
    <div class="text-center" v-if="secretButton" transition="scroll-y-reverse-transition">
      <v-btn class="ma-2" dark color="red" @click.stop="secretDialog=true">画像自由設定</v-btn>
    </div>
    <v-dialog v-model="secretDialog" max-width="600px" transition="scroll-y-reverse-transition">
      <v-card>
        <v-toolbar flat>
          <v-btn icon @click="secretDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>画像のURLを入力</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text dark color="green" @click.stop="changeImage(newPhotoURL)">変更する</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container fluid>
          <v-text-field prepend-icon="mdi-account" v-model="newPhotoURL" clearable></v-text-field>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import Signout from "@/components/Signout.vue";
import DeleteUser from "@/components/DeleteUser.vue";
import firebase from "firebase";
import { db } from "../plugins/firebase";

export default {
  name: "MyProfile",
  components: {
    Signout,
    DeleteUser
  },
  data: () => ({
    currentUser: null,
    alert: {
      isDisplay: false,
      type: "",
      message: ""
    },
    dialog: false,
    newDisplayName: "",
    secretNum: 0,
    secretButton: false,
    secretDialog: false,
    newPhotoURL: ""
  }),

  methods: {
    changeImage(photoURL) {
      this.secretDialog = false;
      this.newPhotoURL = "";
      let user = firebase.auth().currentUser;
      // let photoURL =
      //   "https://i.picsum.photos/id/" +
      //   (Math.floor(Math.random() * 1083) + 1) +
      //   "/400/400.jpg";
      let self = this;
      user
        .updateProfile({
          photoURL: photoURL
        })
        .then(function() {
          // Update successful.
          db.collection("usersCollection")
            .doc(user.uid)
            .update({
              photoURL: photoURL
            })
            .then(() => {
              self.alert = {
                isDisplay: true,
                type: "success",
                message: "プロフィール画像を変更しました。"
              };
            })
            .catch(error => {
              alert(error.message);
            });
        })
        .catch(function(error) {
          alert("change-image" + error);
        });
    },

    changeDisplayName() {
      let newDisplayName = this.newDisplayName;
      if (!newDisplayName) return;
      let user = firebase.auth().currentUser;
      let self = this;
      user
        .updateProfile({
          displayName: newDisplayName
        })
        .then(function() {
          // Update successful.
          db.collection("usersCollection")
            .doc(user.uid)
            .update({ displayName: newDisplayName })
            .then(() => {
              self.alert = {
                isDisplay: true,
                type: "success",
                message: "ユーザー名を変更しました。"
              };
            })
            .catch(error => {
              alert("!", error.message);
            });
        })
        .catch(function(error) {
          alert("change-displayname" + error);
        });
      this.dialog = false;
      this.newDisplayName = "";
    },
    openDialog() {
      this.dialog = !this.dialog;
      let user = firebase.auth().currentUser;
      this.newDisplayName = user.displayName;
    },
    addSecretNum() {
      this.secretNum += 1;
      if (this.secretNum > 5) {
        this.showSecretButton();
      }
    },
    showSecretButton() {
      this.secretButton = true;
    },
    returnRandomImage_m() {
      return (
        "https://i.picsum.photos/id/" +
        (Math.floor(Math.random() * 1083) + 1) +
        "/400/400.jpg"
      );
    }
  },
  created() {
    this.currentUser = firebase.auth().currentUser;
    // console.log("ChatBoard: ", this.currentUser);
  },
  computed: {
    returnRandomImage_c() {
      return (
        "https://i.picsum.photos/id/" +
        (Math.floor(Math.random() * 1083) + 1) +
        "/630/280.jpg"
      );
    }
  }
};
</script>
