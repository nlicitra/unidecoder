<script lang="ts">
  interface Props {
    puzzle: Puzzle;
  }
  let { puzzle }: Props = $props();
</script>

<div id="container">
  <div id="meta">
    Created by {puzzle.createdBy.username} on {puzzle.createdAt.toLocaleDateString()}
  </div>
  <div id="glyphs">
    {#each [...puzzle.glyphs] as g}
      <span>{g}</span>
    {/each}
  </div>
</div>

<style>
  #meta {
    font-style: italic;
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  #container {
    display: grid;
    place-items: center;
    width: 100%;
  }
  #glyphs {
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
    border: 1px solid black;
  }
</style>
