<template>
  <div>
    <v-snackbar v-model="alert.isDisplay" top absolute :color="alert.type">
      {{
      alert.message
      }}
    </v-snackbar>
    <v-card class="mx-auto ma-2" max-width="434" tile>
      <v-img height="100%" :src="returnRandomImage_c">
        <v-row align="end" class="fill-height">
          <v-col align-self="start" class="pa-0" cols="10">
            <v-avatar class="profile" color="grey" size="164" tile>
              <v-img :src="this.currentUser.photoURL"></v-img>
            </v-avatar>
          </v-col>
          <v-col align-self="start" cols="2">
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn dark icon v-on="on">
                  <v-icon style="transform:rotate(0deg);">mdi-cog</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    <Signout />
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <DeleteUser />
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-btn
                      class="px-0"
                      text
                      tile
                      color="teal"
                      @click="changeImage(returnRandomImage_m())"
                    >プロフィール画像変更</v-btn>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-row justify="center">
                      <v-dialog v-model="secretDialog" persistent max-width="290">
                        <template v-slot:activator="{ on }">
                          <v-btn class="px-0" text tile v-on="on" color="red">画像自由設定</v-btn>
                        </template>
                        <v-card>
                          <v-toolbar flat>
                            <v-btn icon @click="secretDialog = false">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>画像のURLを入力</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                              <v-btn
                                text
                                dark
                                color="green"
                                @click.stop="changeImage(newPhotoURL)"
                              >変更する</v-btn>
                            </v-toolbar-items>
                          </v-toolbar>
                          <v-container fluid>
                            <v-text-field
                              prepend-icon="mdi-account"
                              v-model="newPhotoURL"
                              clearable
                            ></v-text-field>
                          </v-container>
                        </v-card>
                      </v-dialog>
                    </v-row>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col class="py-0">
            <v-list-item color="rgba(0, 0, 0, .4)" dark>
              <v-list-item-content>
                <v-list-item-title class="title d-flex">
                  <div class="text-truncate">{{ this.currentUser.displayName }}</div>
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
                <v-list-item-subtitle @click="addSecretNum">{{ this.currentUser.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
    <CommentsList :uid="currentUser.uid" />
    <v-btn loading color="transparent" class="mb-12" depressed block height="100"></v-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import Signout from "@/components/Signout.vue";
import CommentsList from "@/components/CommentsList.vue";
import DeleteUser from "@/components/DeleteUser.vue";
import firebase from "firebase";
import { db } from "../plugins/firebase";

export default {
  name: "MyProfile",
  components: {
    Signout,
    DeleteUser,
    CommentsList
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
