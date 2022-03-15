<script>
import axios from "axios";

export default {
  data: function () {
    return {
      editUserParams: {},
      errors: [],
    };
  },
  created: function () {
    axios
      .get("/users/me")
      .then((response) => {
        console.log(response.data);
        this.editUserParams = response.data;
      })
      .catch((error) => {
        this.errors = error.response.data.errors;
      });
  },
  methods: {
    updateUser: function () {
      axios
        .patch("/users/me", this.editUserParams)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/users/me");
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>

<template>
  <div class="user-edit">
    <form v-on:submit.prevent="updateUser()">
      <h1>Manage Profile</h1>
      <ul>
        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
      <div>
        <label>Display Name:</label>
        <input type="text" v-model="editUserParams.display_name" />
      </div>
      <div>
        <label>Profile Picture Link:</label>
        <input type="text" v-model="editUserParams.profile_picture" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="editUserParams.email" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="editUserParams.password" />
      </div>
      <div>
        <label>Password confirmation:</label>
        <input type="password" v-model="editUserParams.password_confirmation" />
      </div>
      <input type="submit" value="Update" />
    </form>
  </div>
</template>
