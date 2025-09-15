<script>
    import Welcome from './Welcome.svelte';
    import Question from './Question.svelte';
    import Result from './Result.svelte';

    // Pre-existing state variables
    let quizState = $state('not_started'); // 'not_started', 'in_progress', 'completed'
    let finalResult = $state('');

    // 1. Quiz Data Structure
    const questions = [
        {
            text: '새로운 프로젝트를 시작할 때 가장 먼저 하는 일은?',
            options: ['상세한 계획 세우기', '바로 프로토타입 만들기', '팀원들과 브레인스토밍', '관련 기술 리서치']
        },
        {
            text: '휴가를 보낸다면 어떤 스타일을 선호하시나요?',
            options: ['편안한 집에서 휴식', '새로운 도시 탐험', '자연 속에서 캠핑', '고급 리조트에서 힐링']
        },
        {
            text: '친구가 어려운 문제로 고민할 때 당신의 역할은?',
            options: ['적극적으로 해결책 제시', '조용히 들어주며 공감', '함께 자료를 찾아보며 분석', '기분 전환을 위해 다른 활동 제안']
        },
        {
            text: '어떤 종류의 영화를 가장 즐겨보시나요?',
            options: ['치밀한 SF 스릴러', '따뜻한 감성의 드라마', '화려한 액션 블록버스터', '깊이 있는 다큐멘터리']
        },
        {
            text: '저녁 식사 메뉴를 고를 때 당신의 선택은?',
            options: ['늘 먹던 익숙한 메뉴', '새롭게 뜨는 맛집 도전', '건강을 생각한 샐러드', '직접 만드는 요리']
        }
    ];

    // 2. State Management
    let currentQuestionIndex = $state(0);
    let userAnswers = $state([]);

    // 3. Core Logic Function
    function handleAnswer(selectedOption) {
        // Immutable update
        userAnswers = [...userAnswers, selectedOption];

        if (currentQuestionIndex < questions.length - 1) {
            // If it is NOT the last question
            currentQuestionIndex++;
        } else {
            // If it IS the last question
            quizState = 'completed';
            finalResult = "결과를 분석 중입니다... 잠시만 기다려주세요.";
            
            // Simulate API call for result generation
            setTimeout(() => {
                finalResult = `당신은 ${userAnswers.slice(0, 2).join(', ')} 등의 특징을 가진, 분석적이고 창의적인 해결사 타입입니다!`;
            }, 2000);
        }
    }

    // For completeness
    function startQuiz() {
        quizState = 'in_progress';
    }

    function restartQuiz() {
        quizState = 'not_started';
        currentQuestionIndex = 0;
        userAnswers = [];
        finalResult = '';
    }
</script>

<!-- 4. Component Integration and Markup -->
<div class="quiz-container">
    {#if quizState === 'not_started'}
        <Welcome onStart={startQuiz} />
    {:else if quizState === 'in_progress'}
        <Question 
            question={questions[currentQuestionIndex]} 
            onAnswer={handleAnswer} 
        />
    {:else if quizState === 'completed'}
        <Result 
            resultText={finalResult} 
            onRestart={restartQuiz} 
        />
    {/if}
</div>

<style>
    .quiz-container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        text-align: center;
        border: 1px solid #eee;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    :global(button) {
        margin: 0.5rem;
        padding: 0.8rem 1.5rem;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s;
    }

    :global(button:hover) {
        background-color: #e9e9e9;
    }
</style>