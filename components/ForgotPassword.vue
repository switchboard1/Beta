<template>
  <div class="wrapper">
    <div class="closer" @click="toggleForgotPasswordModal(false)"></div>
    <div class="modal">
      <template v-if="success">
        <h1 class="headline">Email is sent! Check your email to be able to reset your password.</h1>
      </template>
      <template v-else>
        <h1>Forgot Password?</h1>
        <p
          class="mb-8"
        >Enter your username or email address to recieve an email which will allow you to reset your password.</p>
        <v-form
          v-model="valid"
          style="max-width: 400px;"
          class="mx-auto"
          @submit.prevent="submitForm"
          ref="form"
        >
          <v-alert type="error" dense v-if="emailExistError">User with this email does not exist.</v-alert>
          <v-text-field
            outlined
            v-model="email"
            :rules="rules.email"
            type="email"
            label="Username or Email"
            hint="Must be a valid email"
            @input="emailExistError = false"
          />
          <v-btn color="pink" class="white--text px-8" type="submit">Ok</v-btn>
        </v-form>
      </template>
    </div>
  </div>
</template>

<script>
import { auth } from "@/plugins/firebase";
import { mapActions } from "vuex";

export default {
  name: "ForgotPassword",
  props: ["toggleForgotPasswordModal"],
  data() {
    return {
      valid: false,
      success: false,
      email: "",
      emailExistError: false,
      rules: {
        email: [
          value => !!value || "Required.",
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid e-mail.";
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions({
      resetPassword: "auth/resetPassword"
    }),
    toggleSuccess(value) {
      this.success = value;
    },
    async submitForm() {
      if (this.$refs.form.validate()) {
        const res = await auth.fetchSignInMethodsForEmail(this.email);

        if (res.length === 0) {
          this.emailExistError = true;
        } else {
          this.resetPassword({
            email: this.email,
            toggleSuccess: this.toggleSuccess
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  z-index: 30;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
}

.closer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.modal {
  background: #fff;
  width: 80%;
  margin: 0 auto;
  padding: 2rem 4rem;
  text-align: center;
}

@media (max-width: 960px) {
  .modal {
    width: 100%;
  }
}
</style>
