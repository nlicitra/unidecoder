<script lang="ts">
  import { enhance } from "$app/forms";
  import PuzzleDisplay from "./PuzzleDisplay.svelte";

  interface Props {
    puzzle: Puzzle;
    solveState?: "valid" | "invalid";
  }
  let { puzzle, solveState }: Props = $props();

  let isSolved = $derived(solveState === "valid");
</script>

<form method="post" action="?/solve" use:enhance>
  <PuzzleDisplay {puzzle} />
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
</form>

<style>
  form {
    display: grid;
    background: lightgray;
    place-items: center;
    gap: 0.25rem;
    border: 2px solid;
    padding: 1rem;
    box-shadow: 4px 4px 2px gray;
  }
</style>
