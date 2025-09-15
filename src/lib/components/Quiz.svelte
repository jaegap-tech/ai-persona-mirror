<script>
    import Welcome from './Welcome.svelte';
    import Question from './Question.svelte';
    import Result from './Result.svelte';

    let quizState = $state('not_started'); // 'not_started', 'in_progress', 'completed'
    let currentQuestionIndex = $state(0);
    let userAnswers = $state([]);
    let finalResult = $state('');

    const questions = [
        {
            text: '주말에 당신은 무엇을 하고 싶나요?',
            options: ['친구들과 파티하기', '집에서 책 읽기', '산으로 하이킹 가기', '새로운 기술 배우기']
        },
        {
            text: '가장 중요하게 생각하는 가치는 무엇인가요?',
            options: ['성공과 성취', '안정과 평화', '모험과 자유', '지식과 지혜']
        },
        {
            text: '문제가 발생했을 때 당신의 첫 반응은?',
            options: ['즉시 해결책을 찾는다', '차분히 원인을 분석한다', '다른 사람에게 조언을 구한다', '일단 거리를 두고 생각한다']
        }
    ];

    function startQuiz() {
        quizState = 'in_progress';
    }

    function handleAnswer(selectedOption) {
        userAnswers.push(selectedOption);
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
        } else {
            quizState = 'completed';
            finalResult = '결과 분석 중...';
            // Simulate API call to generate persona
            setTimeout(() => {
                finalResult = `당신은 ${userAnswers.join(', ')} 특징을 가진 창의적인 탐험가입니다.`;
            }, 1500);
        }
    }

    function restartQuiz() {
        quizState = 'not_started';
        currentQuestionIndex = 0;
        userAnswers = [];
        finalResult = '';
    }
</script>

{#if quizState === 'not_started'}
    <Welcome onStart={startQuiz} />
{:else if quizState === 'in_progress'}
    <Question question={questions[currentQuestionIndex]} onAnswer={handleAnswer} />
{:else if quizState === 'completed'}
    <Result resultText={finalResult} onRestart={restartQuiz} />
{/if}
