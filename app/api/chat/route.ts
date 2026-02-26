import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'AI assistant is not configured' },
                { status: 503 }
            );
        }

        const { messages, slug } = await req.json();

        if (!slug || !messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Fetch org data, services, and availability from Supabase
        const supabase = createSupabaseServiceClient();

        const { data: org } = await supabase
            .from('organizations')
            .select('id, name, timezone')
            .eq('slug', slug)
            .single();

        if (!org) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const { data: services } = await supabase
            .from('services')
            .select('name, description, duration, price, currency, is_active')
            .eq('org_id', org.id)
            .eq('is_active', true);

        const { data: availability } = await supabase
            .from('availability')
            .select('day_of_week, start_time, end_time, is_active')
            .eq('org_id', org.id)
            .eq('is_active', true)
            .order('day_of_week');

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const availText = (availability || [])
            .map((a) => `${dayNames[a.day_of_week]}: ${a.start_time} — ${a.end_time}`)
            .join('\n');

        const servicesText = (services || [])
            .map((s) => `• ${s.name} (${s.duration} min${s.price ? `, $${s.price} ${s.currency}` : ', Free'})${s.description ? ` — ${s.description}` : ''}`)
            .join('\n');

        const systemPrompt = `You are a friendly and helpful booking assistant for "${org.name}". Your job is to help clients choose the right service and find a suitable time to book an appointment.

BUSINESS INFO:
- Name: ${org.name}
- Timezone: ${org.timezone}

AVAILABLE SERVICES:
${servicesText || 'No services have been configured yet.'}

WORKING HOURS:
${availText || 'No availability has been set yet.'}

RULES:
1. Be warm, concise, and professional. Keep responses short (2-3 sentences max).
2. Help clients understand what services are offered and recommend the best fit.
3. When a client wants to book, confirm the service, suggest available days/times based on the working hours, and ask for their name & email.
4. You CANNOT actually create bookings — tell the client to use the booking form on the page or that you've noted their preferred time.
5. If asked about something outside booking/services, politely redirect to booking.
6. Use emojis sparingly for a friendly feel.
7. Never make up services or availability that aren't listed above.`;

        // Build conversation history for Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const chat = model.startChat({
            history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            })),
            systemInstruction: systemPrompt,
        });

        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(lastMessage.content);
        const reply = result.response.text();

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to get response' },
            { status: 500 }
        );
    }
}
