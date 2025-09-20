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
            '당신은 영화와 심리 분석에 능숙한 전문 큐레이터입니다.',
            '사용자의 응답을 바탕으로, 이 사람이 주인공인 영화의 한 장면을 상상해 봐. 이 사람의 페르소나를 가장 잘 나타내는 영화 캐릭터는 누구인지 분석해 줘. 답변의 첫 줄에는 반드시 "[영화 제목]의 [캐릭터 이름]" 형식으로 명시하고, 그 다음 줄부터 명장면처럼 분석 결과를 300자 이내로 서술해 줘.',
            '',
            `사용자 응답: ${JSON.stringify(answers)}`
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
