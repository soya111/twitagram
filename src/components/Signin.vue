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
              <span class="headline">ログイン</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
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
              <v-btn color="blue darken-1" text @click="signIn">ログイン</v-btn>
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
  name: "Signin",
  data: () => ({
    username: "",
    password: "",
    alert: {
      isDisplay: false,
      type: "",
      message: ""
    }
  }),
  methods: {
    signIn() {
      this.alert.isDisplay = false;

      if (!this.username || !this.password) {
        this.alert = {
          isDisplay: true,
          type: "error",
          message: "全て入力してください。"
        };
        return;
      }

      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then(() => {
          this.alert = {
            isDisplay: true,
            type: "success",
            message: "ログインしました。"
          };
          this.username = this.password = "";
        })
        .catch(error => {
          this.alert = {
            isDisplay: true,
            type: "error"
          };
          switch (error.message) {
            case "The email address is badly formatted.":
              this.alert.message = "正しいメールアドレスを入力してください。";
              break;
            case "The password is invalid or the user does not have a password.":
            case "There is no user record corresponding to this identifier. The user may have been deleted.":
              this.alert.message =
                "メールアドレスかパスワードが間違っています。";
              break;
            case "The user account has been disabled by an administrator.":
              this.alert.message =
                "このアカウントは管理者によって凍結されました";
              this.alert.type = "warning";
              break;
            default:
              alert(error);
          }
        });
      this.dialog = false;
    }
  }
  //   ,
  //   created() {
  //     firebase.auth().onAuthStateChanged(user => {
  //       this.signedOut = !user;
  //     });
  //   }
};
</script>
