<script>
    let { question, onAnswer } = $props();
</script>

<h2>{question.text}</h2>
<div>
    {#each question.options as option}
        <button onclick={() => onAnswer(option)}>
            {option}
        </button>
    {/each}
</div>
