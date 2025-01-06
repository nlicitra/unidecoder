<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import type { Snippet } from "svelte";
  import type { LayoutServerData } from "./$types";

  interface Props {
    data: LayoutServerData;
    children: Snippet;
  }

  let { data, children }: Props = $props();

  async function logout() {
    try {
      await fetch("/auth/logout", {
        method: "POST",
      });
      invalidateAll();
    } catch (e) {
      console.error(e);
    }
  }
</script>

<nav>
  <a href="/">Home</a>
  <a href="/p/create">Create</a>
  {#if data.user}
    <button id="logout" onclick={logout}>Log out</button>
  {:else}
    <a id="login" href="/auth/login">Login</a>
  {/if}
</nav>

{#key data.user}
  {@render children()}
{/key}

<style>
  nav {
    display: flex;
    gap: 1rem;
  }

  #login,
  #logout {
    margin-left: auto;
  }
</style>
