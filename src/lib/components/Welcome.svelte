<script>
    let { onStart } = $props();
</script>

<section class="flex min-h-[320px] flex-col items-center justify-center gap-6 text-center">
  <h1 class="text-3xl font-bold text-slate-800 sm:text-4xl">AI 페르소나 미러</h1>
  <p class="max-w-xl text-lg text-slate-600">
    몇 가지 질문에 답하고 당신의 AI 페르소나를 확인해보세요.
  </p>
  <button
    class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
    onclick={onStart}
  >
    퀴즈 시작하기
  </button>
</section>
