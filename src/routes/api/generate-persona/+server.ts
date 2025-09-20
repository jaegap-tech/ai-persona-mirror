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
            '사용자의 응답을 바탕으로, 이 사람이 주인공인 영화의 한 장면을 상상해 결과를 전합니다.',
            '반드시 320자 이내의 한국어 답변을 아래 형식으로 작성하세요.',
            '',
            '1) 첫 줄: "[영화 제목]의 [캐릭터 이름]"',
            '2) 두 번째 줄부터 네 번째 줄까지: 명장면을 묘사하듯 3~4문장으로 사용자 성향과 캐릭터의 공통점을 설명하세요. 존댓말을 사용하고, 사용자 응답을 최소 2회 직접 언급하세요.',
            '3) 마지막 줄: 성향을 요약하는 한국어 해시태그 3개를 "#단어 #단어 #단어" 형태로 작성하세요.',
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
