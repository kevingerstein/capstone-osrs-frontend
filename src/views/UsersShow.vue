<script>
import axios from "axios";

export default {
  data: function () {
    return {
      user: {},
    };
  },
  created: function () {
    axios
      .get("/users/me")
      .then((response) => {
        console.log(response.data);
        this.user = response.data;
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  },
  methods: {
    destroyUser: function () {
      if (confirm("Are you sure you to delete your account?")) {
        axios.delete("/users/me").then((response) => {
          console.log(response.data);
          delete axios.defaults.headers.common["Authorization"];
          localStorage.removeItem("jwt");
          this.$router.push("/");
        });
      }
    },
  },
};
</script>

<template>
  <div class="user-show">
    <h1>Profile</h1>
    <p>Email: {{ user.email }}</p>
    <p>Display Name: {{ user.display_name }}</p>
    <img v-if="user.profile_picture" :src="user.profile_picture" alt="none" />
    <br />
    <router-link to="me/edit">Edit</router-link>
    <br />
    <button v-on:click="destroyUser()">Delete</button>
  </div>
</template>
