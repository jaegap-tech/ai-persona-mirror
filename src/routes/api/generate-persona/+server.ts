import { json, type RequestHandler } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// 사용 모델: 최신 안정 모델로 교체 가능 (예: 'gemini-2.5-pro')
const MODEL = 'gemini-2.5-flash';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { answers } = await request.json();

        if (!Array.isArray(answers) || answers.length === 0) {
            return json({ error: 'answers required' }, { status: 400 });
        }

        const prompt = [
            '당신은 심리 및 성격 분석 전문가입니다.',
            '다음은 사용자의 퀴즈 응답 목록입니다.',
            '응답을 종합적으로 분석하여 다음을 포함한 마크다운 보고서를 작성하세요:',
            '- 핵심 페르소나 요약(2~3문장)',
            '- 성향(예: 내향/외향, 학습 스타일) 불릿',
            '- 개발자 관점의 강점/리스크',
            '- 커리어 추천(주니어 개발자 관점, 3가지)',
            '- 비유 1문장(친근하고 재치있게)',
            '',
            `응답: ${JSON.stringify(answers)}`
        ].join('\n');

        const model = genAI.getGenerativeModel({ model: MODEL });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return json({ ok: true, persona: text });
    } catch (error) {
        console.error(error);
        return json({ error: 'AI generation failed' }, { status: 500 });
    }
};
