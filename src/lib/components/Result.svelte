<script>
    let { resultText, onRestart } = $props();
</script>

<section class="flex flex-col items-center gap-6 text-center">
  <h3 class="text-xl font-medium text-slate-500">당신의 페르소나는...</h3>
  {#if resultText && !resultText.includes('분석 중')}
    <p class="result-gradient w-full max-w-xl rounded-2xl bg-blue-50 p-6 text-3xl font-bold text-blue-700 shadow-inner">
      {resultText}
    </p>
  {:else}
    <p class="text-lg text-slate-500 animate-pulse">
      {resultText || '결과를 생성 중입니다...'}
    </p>
  {/if}
  <button
    class="inline-flex items-center justify-center rounded-lg border-2 border-slate-400 px-6 py-3 text-base font-semibold text-slate-600 transition duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
    onclick={onRestart}
  >
    다시 테스트하기
  </button>
</section>
