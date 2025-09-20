import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase 환경 변수가 설정되지 않았습니다. PUBLIC_SUPABASE_URL과 PUBLIC_SUPABASE_ANON_KEY를 확인하세요.');
}

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false
    }
});
