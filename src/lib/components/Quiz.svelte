<script lang="ts">
    import Welcome from './Welcome.svelte';
    import Question from './Question.svelte';
    import Result from './Result.svelte';
    import { supabase } from '$lib/supabaseClient.js';

    type QuizAxis = 'EI' | 'SN' | 'TF' | 'JP';

    type QuizQuestion = {
        id: number;
        text: string;
        options: string[];
        axis: QuizAxis;
    };

    type QuizState = 'not_started' | 'loading' | 'in_progress' | 'completed';

    let quizState = $state<QuizState>('not_started');
    let currentQuestionIndex = $state(0);
    let userAnswers = $state<{ questionId: number; value: string }[]>([]);
    let questions = $state<QuizQuestion[]>([]);

    function handleAnswer(selectedOption: string) {
        const currentQuestion = questions[currentQuestionIndex];

        if (!currentQuestion) {
            return;
        }

        userAnswers = [...userAnswers, { questionId: currentQuestion.id, value: selectedOption }];

        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
        } else {
            quizState = 'completed';
        }
    }

    async function startQuiz() {
        quizState = 'loading';
        currentQuestionIndex = 0;
        userAnswers = [];
        questions = [];

        try {
            const { data, error } = await supabase.rpc('get_random_quiz_questions');

            if (error) {
                throw error;
            }

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No questions returned from Supabase.');
            }

            questions = data.map((question: Record<string, unknown>) => ({
                id: Number(question.id),
                text: String(question.text ?? ''),
                options: Array.isArray(question.options) ? (question.options as string[]) : [],
                axis: question.axis as QuizAxis
            }));

            quizState = 'in_progress';
        } catch (loadError) {
            console.error('Failed to load quiz questions', loadError);
            quizState = 'not_started';
        }
    }

    function restartQuiz() {
        quizState = 'not_started';
        currentQuestionIndex = 0;
        userAnswers = [];
        questions = [];
    }
</script>

<div class="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100/80 animate-fade-in md:p-10">
  {#if quizState === 'not_started'}
    <Welcome onStart={startQuiz} />
  {:else if quizState === 'loading'}
    <div class="py-16 text-base font-medium text-slate-600">새로운 질문을 불러오는 중...</div>
  {:else if quizState === 'in_progress'}
    {#if questions.length}
      <Question
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
      />
    {:else}
      <div class="py-16 text-base text-slate-600">질문을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</div>
    {/if}
  {:else if quizState === 'completed'}
    <Result
      answers={userAnswers}
      onRestart={restartQuiz}
    />
  {/if}
</div>
