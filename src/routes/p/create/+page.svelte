<script lang="ts">
  import { enhance } from "$app/forms";
  // import { onMount } from "svelte";
  // let ref: HTMLElement;

  // onMount(async () => {
  //   await import("emoji-picker-element");
  //   ref.addEventListener("emoji-click", (e: any) => {
  //     console.log(e.detail.unicode);
  //   });
  // });

  function isEmojiOnly(str: string) {
    const stringToTest = str.replace(/ /g, "");
    const emojiRegex =
      /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
    return emojiRegex.test(stringToTest) && Number.isNaN(Number(stringToTest));
  }

  let glyphs = $state("");
  let solution = $state("");

  let isValid = $derived(
    glyphs.length && solution.length && isEmojiOnly(glyphs),
  );
</script>

<main>
  <form method="post" action="?/create" use:enhance>
    <label>
      Puzzle
      <input
        type="text"
        bind:value={glyphs}
        required
        name="puzzle"
        placeholder="put your emojis here"
      />
    </label>
    <label>
      Solution
      <input
        type="text"
        required
        bind:value={solution}
        name="solution"
        placeholder="What does your puzzle mean?"
      />
    </label>
    <button disabled={!isValid} type="submit">Create</button>
    <!-- <emoji-picker bind:this={ref}></emoji-picker> -->
  </form>
</main>

<style>
  main {
    display: grid;
    place-items: center;
    height: 100dvh;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input:user-invalid {
    background-color: lightpink;
  }
</style>
