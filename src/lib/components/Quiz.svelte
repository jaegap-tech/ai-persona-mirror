<script lang="ts">
    import Welcome from './Welcome.svelte';
    import Question from './Question.svelte';
    import Result from './Result.svelte';

    type QuizQuestion = {
        id: number;
        text: string;
        options: string[];
    };

    let quizState = $state<'not_started' | 'in_progress' | 'completed'>('not_started');
    let currentQuestionIndex = $state(0);
    let userAnswers = $state<{ questionId: number; value: string }[]>([]);

    const questions: QuizQuestion[] = [
        {
            id: 1,
            text: '새로운 하루를 시작할 때 가장 먼저 떠오르는 생각은?',
            options: ['오늘의 계획을 꼼꼼히 정리해야지', '오늘은 어떤 재미가 기다릴까?', '사람들과 나눌 이야기가 궁금해', '조용히 나만의 시간을 즐겨야지']
        },
        {
            id: 2,
            text: '친한 친구가 고민을 털어놓는다면, 당신은 어떻게 반응하나요?',
            options: ['바로 해결책을 찾아보고 돕는다', '끝까지 들어주고 공감해준다', '자료를 찾아 함께 분석한다', '기분 전환이 될 활동을 제안한다']
        },
        {
            id: 3,
            text: '당신이 가장 몰입하는 순간은 언제인가요?',
            options: ['새로운 아이디어를 떠올릴 때', '사람들과 함께 웃고 떠들 때', '차분히 배우고 정리할 때', '몸을 움직이며 활동할 때']
        }
    ];

    function handleAnswer(selectedOption: string) {
        const currentQuestion = questions[currentQuestionIndex];
        userAnswers = [...userAnswers, { questionId: currentQuestion.id, value: selectedOption }];

        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
        } else {
            quizState = 'completed';
        }
    }

    function startQuiz() {
        quizState = 'in_progress';
    }

    function restartQuiz() {
        quizState = 'not_started';
        currentQuestionIndex = 0;
        userAnswers = [];
    }
</script>

<div class="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100/80 animate-fade-in md:p-10">
  {#if quizState === 'not_started'}
    <Welcome onStart={startQuiz} />
  {:else if quizState === 'in_progress'}
    <Question
      question={questions[currentQuestionIndex]}
      onAnswer={handleAnswer}
    />
  {:else if quizState === 'completed'}
    <Result
      answers={userAnswers}
      onRestart={restartQuiz}
    />
  {/if}
</div>
