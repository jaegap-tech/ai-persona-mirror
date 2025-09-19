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
    <div class="space-y-3">
      <div class="h-6 animate-pulse rounded bg-gray-200"></div>
      <div class="h-6 w-2/3 animate-pulse rounded bg-gray-200"></div>
      <div class="h-4 animate-pulse rounded bg-gray-100"></div>
      <div class="h-4 w-1/2 animate-pulse rounded bg-gray-100"></div>
    </div>
  {:else if error}
    <p class="text-red-600">⚠️ {error}</p>
  {:else}
    <article class="prose max-w-none">{@html marked.parse(personaMd)}</article>
  {/if}
  <button
    class="inline-flex items-center justify-center rounded-lg border-2 border-slate-400 px-6 py-3 text-base font-semibold text-slate-600 transition duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
    onclick={onRestart}
  >
    다시 테스트하기
  </button>
</div>
