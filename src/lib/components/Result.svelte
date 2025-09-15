<script>
    let { resultText, onRestart } = $props();
</script>

<h3>당신의 페르소나는...</h3>
<p>
    {resultText || '결과를 생성 중입니다...'}
</p>
<button onclick={onRestart}>
    다시 테스트하기
</button>
