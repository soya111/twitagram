<template>
  <v-footer fixed color="transparent" style="height: 50px;">
    <v-fab-transition>
      <v-btn color="amber darken-4" @click.stop="dialog = !dialog" dark absolute top right fab>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="scroll-y-reverse-transition">
      <v-card>
        <v-toolbar flat>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>コメント</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text dark color="green" @click="sendMessage">コメントする</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container fluid>
          <v-textarea prepend-icon="mdi-account" v-model="message" clearable auto-grow></v-textarea>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- <v-text-field
      class="mt-1 mb-n5"
      v-model="message"
      :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'"
      :prepend-icon="icon"
      required
      dense
      outlined
      dark
      single-line
      clear-icon="mdi-close-circle"
      clearable
      label="Message"
      type="text"
      @click:append-outer="sendMessage"
      @click:prepend="changeIcon"
      @click:clear="clearMessage"
    ></v-text-field>-->
  </v-footer>
</template>

<script>
import { db } from "../plugins/firebase";
import firebase from "firebase";

export default {
  name: "CreateForm",
  data: () => ({
    commentRules: [v => !!v || "コメントは必須項目です"],
    // Formダイアログの表示可否
    show: false,
    message: "Hey!",
    dialog: false
  }),
  methods: {
    // コメント追加
    addComment() {
      if (this.message == "") return;
      const now = new Date();
      let user = firebase.auth().currentUser;
      // コメントをFirestoreへ登録
      db.collection("comments").add({
        tweeterUid: user.uid,
        content: this.message,
        // avatar: user.photoURL,
        // tweeterName: user.displayName,
        likes: 0,
        createdAt: now
      });
    },
    sendMessage() {
      this.closeDialog();
      this.addComment();
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    },
    closeDialog() {
      this.dialog = false;
    }
  },
  computed: {
    icon() {
      return this.icons[this.iconIndex];
    }
  }
};
</script>
