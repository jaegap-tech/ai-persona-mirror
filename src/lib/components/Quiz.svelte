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
            text: '새로운 프로젝트를 시작할 때 가장 먼저 하는 일은?',
            options: ['상세한 계획 세우기', '바로 프로토타입 만들기', '팀원들과 브레인스토밍', '관련 기술 리서치']
        },
        {
            id: 2,
            text: '휴가를 보낸다면 어떤 스타일을 선호하시나요?',
            options: ['편안한 집에서 휴식', '새로운 도시 탐험', '자연 속에서 캠핑', '고급 리조트에서 힐링']
        },
        {
            id: 3,
            text: '친구가 어려운 문제로 고민할 때 당신의 역할은?',
            options: ['적극적으로 해결책 제시', '조용히 들어주며 공감', '함께 자료를 찾아보며 분석', '기분 전환을 위해 다른 활동 제안']
        },
        {
            id: 4,
            text: '어떤 종류의 영화를 가장 즐겨보시나요?',
            options: ['치밀한 SF 스릴러', '따뜻한 감성의 드라마', '화려한 액션 블록버스터', '깊이 있는 다큐멘터리']
        },
        {
            id: 5,
            text: '저녁 식사 메뉴를 고를 때 당신의 선택은?',
            options: ['늘 먹던 익숙한 메뉴', '새롭게 뜨는 맛집 도전', '건강을 생각한 샐러드', '직접 만드는 요리']
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
