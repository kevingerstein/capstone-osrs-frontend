<script>
import axios from "axios";

export default {
  data: function () {
    return {
      newUserParams: {},
      errors: [],
    };
  },
  methods: {
    submit: function () {
      axios
        .post("/users", this.newUserParams)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/users/login");
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
    <form class="form-signin center" v-on:submit.prevent="submit()">
      <img class="mb-4" src="/images/dragon-solid.svg" alt="" width="72" height="72" />
      <h1 class="h3 mb-3 font-weight-normal">Sign Up</h1>
      <hr class="featurette-divider" />

      <label for="inputEmail" class="sr-only mb-2">Email address</label>
      <input
        type="email"
        id="inputEmail"
        class="form-control mb-4"
        placeholder="Email address"
        required
        autofocus
        v-model="newUserParams.email"
      />
      <label for="displayName" class="sr-only mb-2">Display Name</label>
      <input
        type="text"
        id="displayName"
        class="form-control mb-4"
        placeholder="Display Name"
        required
        v-model="newUserParams.display_name"
      />
      <!-- <label>Profile Picture Link:</label>
      <input type="text" v-model="newUserParams.profile_picture" class="form-control mb-4" /> -->
      <label for="inputPassword" class="sr-only mb-2">Password</label>
      <input
        type="password"
        id="inputPassword"
        class="form-control mb-4"
        placeholder="Password"
        required
        v-model="newUserParams.password"
      />
      <label for="inputPassword" class="sr-only mb-2">Password Confirmation</label>
      <input
        type="password"
        id="inputPassword"
        class="form-control mb-4"
        placeholder="Password"
        required
        v-model="newUserParams.password_confirmation"
      />
      <p class="text-danger" v-for="error in errors" :key="error.id">{{ error }}</p>
      <input type="submit" class="btn btn-secondary btn-lg btn-block" style="width: 100%" value="Sign Up" />
    </form>
  </div>
  <!-- <div class="user-signup">
    <form v-on:submit.prevent="submit()">
      <h1>Signup</h1>
      <ul>
        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
      <div>
        <label>Display Name:</label>
        <input type="text" v-model="newUserParams.display_name" />
      </div>
      <div>
        <label>Profile Picture Link:</label>
        <input type="text" v-model="newUserParams.profile_picture" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="newUserParams.email" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="newUserParams.password" />
      </div>
      <div>
        <label>Password confirmation:</label>
        <input type="password" v-model="newUserParams.password_confirmation" />
      </div>
      <input type="submit" value="Submit" />
    </form>
  </div> -->
</template>
