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
          this.$router.push("/equipment-sets");
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>

<template>
  <div class="container-fluid form-body">
    <form class="form-signin center" v-on:submit.prevent="updateUser()">
      <img class="mb-4" src="/images/person-solid.svg" alt="" width="72" height="72" />
      <h1 class="h3 mb-3 font-weight-normal">Edit Profile</h1>
      <hr class="featurette-divider" />

      <label for="inputEmail" class="sr-only mb-2">Email address</label>
      <input
        type="email"
        id="inputEmail"
        class="form-control mb-4"
        placeholder="Email address"
        required
        autofocus
        v-model="editUserParams.email"
      />
      <label for="displayName" class="sr-only mb-2">Display Name</label>
      <input
        type="text"
        id="displayName"
        class="form-control mb-4"
        placeholder="Display Name"
        required
        v-model="editUserParams.display_name"
      />
      <label for="inputPassword" class="sr-only mb-2">Password</label>
      <input
        type="password"
        id="inputPassword"
        class="form-control mb-4"
        placeholder="Password"
        v-model="editUserParams.password"
      />
      <label for="inputPassword" class="sr-only mb-2">Password Confirmation</label>
      <input
        type="password"
        id="inputPassword"
        class="form-control mb-4"
        placeholder="Password"
        v-model="editUserParams.password_confirmation"
      />
      <p class="text-danger" v-for="error in errors" :key="error.id">{{ error }}</p>
      <input type="submit" class="btn btn-secondary btn-lg btn-block" style="width: 100%" value="Update Profile" />
    </form>
  </div>
</template>
