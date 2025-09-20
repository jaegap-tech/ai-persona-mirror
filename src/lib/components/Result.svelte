<script lang="ts">
    import { onMount } from 'svelte';
    import { marked } from 'marked';

    const { answers = [], onRestart } = $props<{
        answers?: { questionId: number; value: string }[];
        onRestart: () => void;
    }>();

    let loading = $state(true);
    let error = $state('');
    let personaMd = $state('');

    onMount(async () => {
        if (!answers.length) {
            error = '응답이 비어있어요.';
            loading = false;
            return;
        }

        try {
            const response = await fetch('/api/generate-persona', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'unknown error');
            }

            personaMd = data.persona ?? '';
        } catch (caughtError: unknown) {
            error = caughtError instanceof Error ? caughtError.message : '요청 중 오류가 발생했어요.';
        } finally {
            loading = false;
        }
    });
</script>

<div class="max-w-2xl mx-auto flex flex-col gap-6 p-6">
  {#if loading}
    <div class="flex flex-col items-center gap-6 text-slate-500">
      <div class="flex h-14 w-14 items-center justify-center rounded-full border-4 border-blue-200 border-t-transparent animate-spin"></div>
      <p class="text-base font-medium">영화 속 친구를 찾는 중이에요...</p>
      <div class="w-full space-y-3">
        <div class="h-6 animate-pulse rounded bg-gray-200"></div>
        <div class="h-6 w-2/3 animate-pulse rounded bg-gray-200"></div>
        <div class="h-4 animate-pulse rounded bg-gray-100"></div>
        <div class="h-4 w-1/2 animate-pulse rounded bg-gray-100"></div>
      </div>
    </div>
  {:else if error}
    <p class="text-red-600">⚠️ {error}</p>
  {:else}
    <div class="space-y-4 text-left">
      <h2 class="text-2xl font-semibold text-slate-800">당신과 닮은 영화 속 친구</h2>
      <p class="text-base text-slate-600">AI 분석으로 찾은 닮은꼴 캐릭터를 확인해보세요.</p>
      <article class="prose max-w-none">{@html marked.parse(personaMd)}</article>
    </div>
  {/if}
  <button
    class="inline-flex items-center justify-center rounded-lg border-2 border-slate-400 px-6 py-3 text-base font-semibold text-slate-600 transition duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
    onclick={onRestart}
  >
    다시 테스트하기
  </button>
</div>
