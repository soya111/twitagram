<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-alert
            v-model="alert.isDisplay"
            :type="alert.type"
            dismissible
            border="left"
            elevation="2"
            colored-border
            transition="scroll-y-transition"
          >{{alert.message}}</v-alert>

          <v-card>
            <v-card-title>
              <span class="headline">ユーザー登録</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="displayName" label="Nickname" required clearable></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="username" label="Email" required clearable></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password"
                      label="Password"
                      type="password"
                      required
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="signUp">登録</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Signup",
  data: () => ({
    displayName: "",
    username: "",
    password: "",
    alert: {
      isDisplay: false,
      type: "",
      message: ""
    }
  }),
  methods: {
    signUp() {
      this.alert.isDisplay = false;

      if (!this.displayName || !this.username || !this.password) {
        this.alert = {
          isDisplay: true,
          type: "error",
          message: "全て入力してください。"
        };
        return;
      }

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.username, this.password)
        .then(() => {
          this.alert = {
            isDisplay: true,
            type: "success",
            message:
              "ユーザー登録ができました。ニックネーム:" + this.displayName
          };
          this.registerDisplayName(this.displayName);
          this.username = this.password = this.displayName = "";
        })
        .catch(error => {
          this.alert = {
            isDisplay: true,
            type: "error"
          };
          switch (error.message) {
            case "The email address is already in use by another account.":
              this.alert.message = "このメールアドレスはすでに使われています。";
              break;
            case "The email address is badly formatted.":
              this.alert.message = "正しいメールアドレスを入力してください。";
              break;
            case "Password should be at least 6 characters":
              this.alert.message = "パスワードは6文字以上にしてください。";
              break;
            default:
              alert(error);
          }
        });
      this.dialog = false;
    },
    registerDisplayName(Nickname) {
      var user = firebase.auth().currentUser;
      if (user != null) {
        user
          .updateProfile({
            displayName: Nickname
          })
          .then(() => {})
          .catch(error => {
            alert(error.message);
          });
      }
    }
  }
};
</script>
