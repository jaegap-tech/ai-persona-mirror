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
    let characterLine = $state('');
    let movieTitle = $state('');
    let characterName = $state('');
    let personaBody = $state('');
    let personaHtml = $state('');
    let hashtags = $state<string[]>([]);

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

    $effect(() => {
        if (!personaMd) {
            characterLine = '';
            movieTitle = '';
            characterName = '';
            personaBody = '';
            personaHtml = '';
            hashtags = [];
            return;
        }

        const lines = personaMd
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        const [firstLineRaw, ...rest] = lines;
        const firstLine = (firstLineRaw ?? '').replace(/^[#*\s]+/, '');
        characterLine = firstLine;

        const nameMatch = firstLine.match(/^\[(.+?)\]\s*의\s*(.+)$/);
        movieTitle = nameMatch?.[1] ?? '';
        characterName = nameMatch?.[2] ?? firstLine.replace(/^\[(.+?)\]\s*의\s*/, '');

        const hashtagIndex = rest.findIndex((line) => line.startsWith('#'));
        if (hashtagIndex !== -1) {
            hashtags = rest[hashtagIndex]
                .split(/\s+/)
                .filter((token) => token.startsWith('#'))
                .slice(0, 3);
            rest.splice(hashtagIndex, 1);
        } else {
            hashtags = [];
        }

        personaBody = rest.join('\n\n');
        const parsed = personaBody ? marked.parse(personaBody) : '';
        personaHtml = typeof parsed === 'string' ? parsed : '';

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
    <div class="space-y-6 text-left">
      <div class="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-lg">
        <span class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">분석 결과</span>
        <h1 class="mt-2 text-3xl font-bold leading-tight">{characterName || characterLine || '영화 속 친구'}</h1>
        {#if movieTitle}
          <p class="mt-2 text-sm text-slate-200">영화: {movieTitle}</p>
        {/if}
      </div>

      {#if personaHtml}
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-slate-800">장면 속 당신</h2>
          <article class="prose max-w-none text-slate-700">{@html personaHtml}</article>
        </section>
      {/if}

      {#if hashtags.length}
        <div class="flex flex-wrap gap-2">
          {#each hashtags as tag}
            <span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{tag}</span>
          {/each}
        </div>
      {/if}

    </div>
  {/if}
  <button
    class="inline-flex items-center justify-center rounded-lg border-2 border-slate-400 px-6 py-3 text-base font-semibold text-slate-600 transition duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
    onclick={onRestart}
  >
    다시 테스트하기
  </button>
</div>
