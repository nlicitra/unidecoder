<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import PuzzleDisplay from "$lib/puzzle/PuzzleDisplay.svelte";

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();

  let solveState: "valid" | "invalid" | undefined = $state();

  let { isOwned, puzzle, isLoggedIn } = data;

  $effect(() => {
    if (!form) {
      solveState = undefined;
      return;
    }
    if (form.success) {
      solveState = "valid";
    } else {
      solveState = "invalid";
      setTimeout(() => {
        solveState = undefined;
      }, 3000);
    }
  });

  let isSolved = $derived(solveState === "valid" || data.completion);

  let showConfirmDelete = $state(false);
</script>

<main>
  {#if isOwned}
    <form method="post" action="?/delete" use:enhance>
      <PuzzleDisplay {puzzle} />
      {#if showConfirmDelete}
        <span> Are you sure you want to delete it?</span>
        <button onclick={() => (showConfirmDelete = false)}>Cancel</button>
        <button type="submit">Yes, definitely delete it.</button>
      {:else}
        <div>This is your very nice puzzle. Bask in its beauty.</div>
        <button onclick={() => (showConfirmDelete = true)}>Delete</button>
      {/if}
    </form>
  {:else}
    <form method="post" action="?/solve" use:enhance class:solved={isSolved}>
      <PuzzleDisplay {puzzle} />
      {#if !isLoggedIn}
        <div>
          <a href="/auth/login">Login</a> or
          <a href="/auth/register">register</a>
          to solve this puzzle.
        </div>
      {:else}
        {#if !isSolved}
          <div>
            <input type="text" name="answer" readonly={isSolved} />
            <button type="submit">Submit</button>
          </div>
        {:else}
          <span>{puzzle.solution}</span>
        {/if}
        {#if solveState === "valid"}
          <div>Correct! 🎉</div>
        {:else if solveState === "invalid"}
          <div>Try again 😭</div>
        {/if}
      {/if}
    </form>
  {/if}
</main>

<style>
  main {
    display: grid;
    place-items: center;
    height: 100dvh;
  }

  form {
    display: grid;
    background: lightgray;
    place-items: center;
    gap: 0.25rem;
    border: 2px solid;
    padding: 1rem;
    box-shadow: 4px 4px 2px gray;
  }

  .solved {
    background-color: lightgreen;
  }
</style>
