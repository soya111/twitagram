<template>
  <div>
    <v-dialog v-model="displayForm" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn class="ma-2" color="secondary" dark v-on="on">Tweet</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Tweet</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="inputComment"
                    :rules="commentRules"
                    label="Content"
                    required
                  ></v-text-field>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="hideCreateForm">Close</v-btn>
          <v-btn color="blue darken-1" :disabled="!valid" @click="addComment" text>Comment!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "../plugins/firebase";

export default {
  name: "CreateForm",
  data: () => ({
    // form入力データ
    inputComment: "",
    // バリデーション
    valid: true,
    commentRules: [v => !!v || "コメントは必須項目です"],
    // Formダイアログの表示可否
    displayForm: false
  }),
  methods: {
    // コメント追加
    addComment() {
      const now = new Date();
      // コメントをFirestoreへ登録
      db.collection("comments").add({
        content: this.inputComment,
        avatar:
          "https://i.picsum.photos/id/" +
          (Math.floor(Math.random() * 1083) + 1) +
          "/200/200.jpg",
        likes: 0,
        createdAt: now
      });
      // ダイアログを閉じる
      this.hideCreateForm();
    },
    // Formの初期化
    clear() {
      this.$refs.form.reset();
    },
    // Formダイアログの表示
    showCreateForm() {
      this.displayForm = true;
    },
    //
    // Formダイアログの非表示
    hideCreateForm() {
      this.clear();
      this.displayForm = false;
    }
  }
};
</script>