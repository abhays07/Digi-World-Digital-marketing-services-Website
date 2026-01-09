import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!apiKey) {
  console.error('❌ Missing VITE_GEMINI_API_KEY in .env');
}

// Initialize safely to prevent app crash if key is missing
let ai: any = null;

if (apiKey) {
  try {
    // @ts-ignore
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.warn("Failed to initialize Google GenAI", error);
  }
} else {
  console.warn('⚠️ Chatbot disabled: Missing VITE_GEMINI_API_KEY in .env');
}

// You can tweak prompt to match Digi-World Promotions tone
const SYSTEM_PROMPT = `
You are the AI assistant for Digi-World Promotions, a political strategy and digital marketing agency based in Panna, Madhya Pradesh.
Your goal is to help users with political campaigns, social media management, and branding.

Company Info:
- Name: Digi-World Promotions
- Founders: Vikram Singh Rajpoot (Founder), Abhay Singh Rajput (Co-Founder)
- Location: Bhopal, Madhya Pradesh, India. (Remote operations in MP & UP)
- Contact: +91 6265180430, digiworldofficial@zohomail.in
- Experience: 5+ Years, 100+ Politicians Served, 100% Winning Commitment.

Services:
1. Political Strategy & Consulting: Data-driven roadmaps.
2. Social Media Management: FB, Twitter, Instagram, YouTube.
3. Graphics Designing: Viral posters, banners, infographics.
4. Video Editing & Production: Reels, interviews, campaign highlights.
5. Election Campaign Management: War room setup, volunteer coordination.
6. Facebook & Instagram Ads: Targeted advertising.
7. Content Writing: Speeches, captions, press releases.

Packages:
- Silver (Starter): Basic Social Media, 15 Graphics/mo, Basic Content.
- Gold (Most Popular): Daily Posting, 4 Reels, Basic Ads, Strategy, Priority Support.
- Diamond (Premium): Complete Management, Aggressive Ads, High-End Video, 24/7 War Room.

Key Achievements:
- MP Assembly Elections 2023: Managed 5 constituencies, 300% reach increase.
- Bihar Assembly Elections 2025 (Upcoming): Strategic planning for youth engagement.
- Panna Jila Panchayat: Grassroots victory using low-cost creatives.

Mission:
To provide politicians with digital tools, strategies, and content to connect authentically with voters and win elections.

Join Our Team (Job Opportunities):
We are looking for creative and passionate individuals:
- Photographer
- Graphics Designer
- Video Editor
- Meta Ads Specialist

If a user asks about jobs/careers, say: "We are looking for Photographers, Graphics Designers, Video Editors, and Meta Ads Specialists. If you are passionate about creating impactful digital content, please reach out to us at +91 6265180430 or digiworldofficial@zohomail.in."

Rules:
- Answer in short, clear, friendly sentences.
- Use the provided information to answer questions accurately.
- If asked about prices, say: "Our pricing depends on the campaign needs. Please contact us via the Packages or Contact section for exact details."
- If user asks something unrelated, politely steer back to political campaigns and digital promotion.
- Be professional yet engaging.
- Do NOT use markdown formatting (no bold **, no italics *, no headers #). Use plain text only.
`;

export async function askGemini(message: string): Promise<string> {
  if (!ai) {
    return "Chatbot is currently disabled (API Key missing). Please contact admin.";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // or gemini-1.5-flash if you prefer
      contents: [
        SYSTEM_PROMPT,
        `User: ${message}`,
      ],
    });

    // Handle different response structures
    const resp = response as unknown as { candidates?: { content?: { parts?: { text?: string }[] } }[]; text?: string | (() => string) };
    const candidateText = resp.candidates?.[0]?.content?.parts?.[0]?.text;
    const textProperty = typeof resp.text === 'string' ? resp.text : undefined;
    const textMethod = typeof resp.text === 'function' ? resp.text() : undefined;
    
    let text = candidateText || textProperty || textMethod || "";
    
    // Clean up text: remove ** and other markdown if present
    text = text.replace(/\*\*/g, '').replace(/^#+\s/gm, '').trim();

    return text || "I'm here to help with your campaign. Could you please rephrase that?";
  } catch (err) {
    console.error('Gemini error:', err);
    return 'Sorry, I could not reach our AI assistant right now. Please try again in a moment or use the Contact form.';
  }
}
