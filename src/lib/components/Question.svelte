<script>
    let { question, onAnswer } = $props();
</script>

<section class="flex flex-col items-stretch gap-6 text-center md:text-left">
  <h2 class="text-2xl font-semibold text-slate-900 sm:text-3xl">{question.text}</h2>
  <div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
    {#each question.options as option}
      <button
        class="group flex h-full w-full flex-col justify-center rounded-xl border border-slate-200 bg-slate-100 p-4 text-left text-base font-medium text-slate-800 transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
        onclick={() => onAnswer(option)}
      >
        {option}
      </button>
    {/each}
  </div>
</section>
