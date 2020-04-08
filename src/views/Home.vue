<template>
  <div class="home">
    <ChatBoard v-show="bottomNav=='timeline'" />
    <MyProfile v-show="bottomNav=='profile'" />
    <ChatForm />
    <v-bottom-navigation fixed v-model="bottomNav" grow color="teal">
      <router-link class="link" :to="'/'">
        <v-btn value="timeline">
          <span>タイムライン</span>
          <v-icon>mdi-chart-timeline-variant</v-icon>
        </v-btn>
      </router-link>

      <!-- <v-btn value="favorites">
        <span>Favorites</span>
        <v-icon>mdi-heart</v-icon>
      </v-btn>-->
      <router-link class="link" :to="'/profile'">
        <v-btn value="profile">
          <span>プロフィール</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </router-link>
    </v-bottom-navigation>
  </div>
</template>

<script>
// @ is an alias to /src
import ChatBoard from "@/components/ChatBoard.vue";
import ChatForm from "@/components/Form.vue";
import MyProfile from "@/components/MyProfile.vue";

export default {
  name: "Home",
  components: {
    ChatBoard,
    ChatForm,
    MyProfile
  },
  data() {
    return {
      bottomNav: "timeline"
    };
  }
};
</script>

<style scoped>
.link {
  display: flex;
  text-decoration: none;
  color: teal;
}
</style>
