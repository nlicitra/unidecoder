<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();
</script>

<div id="container">
  <h1>Register</h1>
  <form method="post" action="?/register" use:enhance>
    <label>
      Username
      <input name="username" />
    </label>
    <label>
      Password
      <input type="password" name="password" />
    </label>
    <button>Register</button>
  </form>
  <div id="register-cta">
    Already have an account? <a href="/auth/login">Login here!</a>
  </div>
  <p style="color: red">{form?.message ?? ""}</p>
</div>

<style>
  #container {
    max-width: 20rem;
    margin: auto;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input {
    width: 100%;
    box-sizing: border-box;
  }

  #register-cta {
    width: 100%;
    gap: 0.5rem;
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
</style>
