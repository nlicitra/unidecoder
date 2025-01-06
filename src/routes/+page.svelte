<script lang="ts">
  import PuzzleDisplay from "$lib/puzzle/PuzzleDisplay.svelte";
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();
</script>

<h1>Welcome to Uni-De-Code</h1>
<div id="puzzle-list">
  {#each data.puzzles as puzzle}
    <a
      href="/p/{puzzle.id}"
      class="puzzle-container"
      class:solved={puzzle.completion}
    >
      <PuzzleDisplay {puzzle} />
    </a>
  {/each}
</div>

<style>
  #puzzle-list {
    display: flex;
    flex-direction: column;
    max-width: 25rem;
    width: 100%;
    margin: auto;
    gap: 1rem;
  }

  a {
    text-decoration: none;
    border: 1px solid;
    padding: 0.5rem;
  }

  .solved {
    background-color: lightgreen;
  }
</style>
