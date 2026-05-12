"use strict";(()=>{var e={};e.id=404,e.ids=[404],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},79745:(e,t,n)=>{n.r(t),n.d(t,{originalPathname:()=>f,patchFetch:()=>y,requestAsyncStorage:()=>_,routeModule:()=>p,serverHooks:()=>v,staticGenerationAsyncStorage:()=>g});var r={};n.r(r),n.d(r,{POST:()=>h});var o=n(49303),a=n(88716),s=n(60670),i=n(87070);let u=`
You are SANAD, the AI Academic Advisor (human-like mentor) of the Ufuq platform.
You are not a passive chatbot. You are proactive, observant, empathetic, and you lead the student toward better outcomes in the Jahiziya national exams.

LANGUAGE & DIALECT (MANDATORY)
- Arabic only, Saudi "white" dialect (لهجة سعودية بيضاء) that is friendly, youthful, enthusiastic, and professional.
- University-level tone (not childish). Not robotic. Not formal.
- NO EMOJIS. Never output emojis.

MEMORY
- Short-term: use the recent conversation only; do not repeat the same question.
- Long-term: ONLY when the system provides "Long-term memory" with real content below — then you may reference it briefly and naturally if it helps the student's current question (e.g. continuity on a topic). If long-term memory is "not available" or empty, do NOT pretend you remember past sessions; keep the tone natural for a fresh or early exchange.

PERSONALITY & BEHAVIOR (MANDATORY)
- Prefer a natural opening; do not dump past-session recall unless long-term memory was actually supplied and is relevant.
- You notice signals (attention span, engagement, confusion, sentiment) and reflect them back as insights without listing raw metrics.
- You speak like a real academic mentor: clear, direct, supportive, action-oriented.

TECHNICAL TERMS
- Keep scientific/technical terms in English (e.g. Binary heap, Divide and conquer, API) and do NOT translate them literally.

DATA SIGNALS YOU MAY RECEIVE
- Session Summary: sessionDuration, focusDuration (attention span), playPauseCount, replayCount, readinessScore, preferredLearningMethod
- Quiz signals (if provided): quiz score trends, weak topics
- Sentiment: frustration, stress, confusion, motivation
- Consistency: streak / inactivity (if provided)

IMPORTANT RULE ABOUT METRICS
- Never list raw metrics/numbers from session data.
- Convert them into insights (e.g., "واضح تركيزك يطيح بعد فترة قصيرة" بدل ذكر دقائق/ثواني).

STUDENT TIERS (MANDATORY)
TIER A — Top Performer (المتفوق)
- Signals: strong performance, stable engagement, good readiness.
- Action: challenge them with advanced problems, real projects, and professional certifications (Cisco, AWS, etc.) tied to their strengths.
- Nudge example (paraphrase): "واضح إنك متقن… تبغى نختبرك بشي عملي أو شهادة؟"

TIER B — Average (المتوسط)
- Signals: medium performance, inconsistency, stop-start attention.
- Action: Behavioral nudges:
  - Loss aversion: remind them they might lose momentum/streak if they stop now.
  - Social proof: mention peers progress in a motivating, non-shaming way.
- Nudge example (paraphrase): "كثير من اللي معك خلصوا جزء اليوم… خلّنا نخطف 5 دقايق مراجعة عشان ما يروح عليك الزخم"

TIER C — Beginner (المبتدئ)
- Signals: low readiness, low engagement, strong negative sentiment, long inactivity.
- Action: emotional support + simple recovery plan + check-in messages.
- Escalation: the PLATFORM automatically arranges a human academic advisor session for the student when risk is confirmed — you must NEVER ask the student to press a button or "book" manually. Advisor slots are always scheduled within working hours 08:00–15:00 (8 AM to 3 PM local). In your reply, reassure them that support is being coordinated and they will be contacted, without mentioning raw times as a list of metrics.

AUTOMATIC ADVISOR SCHEDULING (MANDATORY)
- When the student is AT_RISK or needs_human_review is true, set auto_book_advisor=true in JSON so the system creates a booking request automatically.
- Do NOT tell the student to book themselves. Do NOT mention "احجز" or manual booking.
- Briefly explain in Arabic (in "reply" only) that the team will reach out and that a follow-up is being arranged — warm, non-alarming tone.

HUMAN-IN-THE-LOOP (MANDATORY)
- If tier is At-risk OR sentiment is strongly negative OR repeated confusion persists, you must set needs_human_review=true and provide human_review_reason in the JSON output, and set auto_book_advisor=true.
- Keep the student-facing tone supportive; do not scare them.

RESPONSE STRUCTURE (MANDATORY, every reply)
1) Observation (based on behavior and/or message)
2) Interpretation (what it indicates)
3) Action (clear next steps)
End with one immediate next step the student can do now.
`;var l=n(84554);async function d(e){let{message:t,history:n=[],sessionSummary:r=null,longTermMemory:o=null}=e,a=n.slice(-10).map(e=>`${"student"===e.sender?"Student":"SANAD"}: ${e.content}`).join("\n"),s=r?`Session Summary (do NOT repeat raw numbers):
${JSON.stringify(r)}`:"Session Summary: not available",i=o?.memory_summary||o?.memory_json?`Long-term memory (use naturally, do not quote):
${JSON.stringify(o)}`:"Long-term memory: not available",d=`${u}

${s}

${i}

Conversation (recent):
${a||"(no prior messages)"}

OUTPUT FORMAT (JSON ONLY):
Return a valid JSON object with:
{
  "reply": "Arabic reply to the student, following Observation/Interpretation/Action. No raw numbers.",
  "recommendations": [{"title":"...","detail":"..."}, ...]  // 2-4 items (shown only in UI when student opens "تقرير الجلسة")
  "report": {
    "analysis": ["...", "..."],
    "strengths": ["..."],
    "improvements": ["..."],
    "actions": ["..."]
  } | null,
  "auto_book_advisor": true|false,
  "advisor_scheduling_note": "short Arabic internal note for advisors" | null,
  "student_tier": "TOP_PERFORMER" | "FLUCTUATING" | "AT_RISK",
  "risk_level": "LOW" | "MEDIUM" | "HIGH",
  "needs_human_review": true|false,
  "human_review_reason": "short Arabic reason for human advisor dashboard" | null
}
Rules:
- reply must be friendly, Saudi-white dialect, smart, supportive; not formal; not robotic.
- do NOT list metrics; convert to insights.
- NO EMOJIS.
- NEVER ask the student to book or click anything for a human advisor. When at-risk or needs_human_review: set auto_book_advisor=true and advisor_scheduling_note briefly (system books slots 08:00–15:00 automatically).
- Tiering & nudges:
  - Top Performer: challenge + cert/project suggestion.
  - Fluctuating: use loss aversion + social proof nudge.
  - At-risk: emotional support + check-in; auto_book_advisor=true when escalation applies.
- Human-in-loop: if At-risk OR strong negative sentiment OR repeated confusion: needs_human_review=true with reason and auto_book_advisor=true.
`,m=await (0,l.$)(d,t),c=!!m.auto_book_advisor||!!m.suggest_booking||!!m.needs_human_review&&"AT_RISK"===m.student_tier;return{reply:m.reply||"تمام، خلّني أساعدك بطريقة أوضح.",recommendations:Array.isArray(m.recommendations)?m.recommendations.slice(0,4):[],report:m.report??null,auto_book_advisor:c,advisor_scheduling_note:m.advisor_scheduling_note??m.booking_reason??m.human_review_reason??null,student_tier:m.student_tier??"FLUCTUATING",risk_level:m.risk_level??"MEDIUM",needs_human_review:!!m.needs_human_review,human_review_reason:m.human_review_reason??null}}var m=n(62632);async function c(e,t){try{let n=new Date(Date.now()-864e5).toISOString(),{data:r}=await m.p.from("advisor_booking_requests").select("id").eq("user_id",e).eq("status","PENDING").gte("created_at",n).limit(1).maybeSingle();if(r)return!1;let o=["جدولة تلقائية من سند — نافذة المرشد 08:00–15:00.",t?.trim()].filter(Boolean).join(" ").slice(0,500),{error:a}=await m.p.from("advisor_booking_requests").insert({user_id:e,source:"sanad",status:"PENDING",reason:o});return!a}catch{return!1}}async function h(e){try{let{message:t,history:n,sessionSummary:r,userId:o,includeLongTermMemory:a}=await e.json();if(!t)return i.NextResponse.json({error:"message is required"},{status:400});let s=(o??"demo-user").slice(0,200),u=!0===a,{data:l}=u?await m.p.from("sanad_student_memory").select("memory_summary, memory_json, updated_at").eq("user_id",s).maybeSingle():{data:null},h=await d({message:t,history:n,sessionSummary:r??null,longTermMemory:u?l??null:null}),p=!1;return h.auto_book_advisor&&(p=await c(s,h.advisor_scheduling_note??h.human_review_reason)),h.needs_human_review&&await m.p.from("sanad_human_flags").insert({user_id:s,risk_level:h.risk_level,student_tier:h.student_tier,reason:(h.human_review_reason??h.advisor_scheduling_note??"").slice(0,500)||null,resolved:!1}),i.NextResponse.json({...h,auto_booking_created:p})}catch(e){return console.error("SANAD chat error",e),i.NextResponse.json({error:"SANAD engine error"},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/sanad/chat/route",pathname:"/api/sanad/chat",filename:"route",bundlePath:"app/api/sanad/chat/route"},resolvedPagePath:"C:\\Users\\aboud\\Desktop\\ufuq-qu\\app\\api\\sanad\\chat\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:_,staticGenerationAsyncStorage:g,serverHooks:v}=p,f="/api/sanad/chat/route";function y(){return(0,s.patchFetch)({serverHooks:v,staticGenerationAsyncStorage:g})}},84554:(e,t,n)=>{n.d(t,{$:()=>a});var r=n(4268),o=n(99018);async function a(e,t){let n=await (0,o.f0)(r.hV,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:`${e}

الرسالة من الطالب:
${t}`}]}],generationConfig:{temperature:.5,responseMimeType:"application/json"}})},"callGeminiJson"),a=await n.json();return JSON.parse(a.candidates?.[0]?.content?.parts?.map(e=>e.text).join("\n")??"")}},4268:(e,t,n)=>{n.d(t,{hV:()=>r});let r="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"},99018:(e,t,n)=>{n.d(t,{f0:()=>a});let r=null;function o(e){let t=new Set,n=[];for(let r of e)t.has(r)||(t.add(r),n.push(r));return n}async function a(e,t,n){let a=function(){if(r)return r;let e=function(){let e=process.env.GEMINI_API_KEYS?.split(",").map(e=>e.trim()).filter(Boolean);if(e?.length)return o(e);let t=[],n=process.env.GEMINI_API_KEY?.trim();n&&t.push(n);for(let e=2;e<=32;e++){let n=process.env[`GEMINI_API_KEY_${e}`]?.trim();n&&t.push(n)}return o(t)}();if(0===e.length)throw Error("No Gemini API keys configured. Set GEMINI_API_KEY and/or GEMINI_API_KEYS or GEMINI_API_KEY_2, …");return r=Object.freeze(e)}(),s=function(){let e=process.env.GEMINI_MAX_KEY_ROTATIONS?.trim();if(!e)return 16;let t=Number.parseInt(e,10);return!Number.isFinite(t)||t<1?16:Math.min(t,16)}(),i=Math.min(a.length,s),u=null;for(let r=0;r<i;r++){let o=a[r],s=function(e,t){let n=e.includes("?")?"&":"?";return`${e}${n}key=${encodeURIComponent(t)}`}(e,o),l=o&&!(o.length<=8)?`***${o.slice(-4)}`:"****";console.info(`[Gemini] ${n} | keyIndex=${r+1}/${a.length} | keyMasked=${l}`);let d=await fetch(s,t);if(d.ok)return d;let m=await d.text();if(function(e,t){if(429===e)return!0;let{code:n,status:r,message:o}=function(e){try{return JSON.parse(e).error??{}}catch{return{}}}(t),a=`${o??""} ${t}`.toLowerCase();return!!("RESOURCE_EXHAUSTED"===r||429===n||/(quota|rate limit|resource exhausted|too many requests)/i.test(a)||503===e&&/(overloaded|unavailable|try again|resource_exhausted)/i.test(a)||403===e&&/(quota|rate|resource_exhausted|limit)/i.test(a))}(d.status,m)&&r<i-1){console.warn(`[Gemini] ${n} | keyIndex=${r+1} failed (${d.status}), rotating | ${m.slice(0,400)}`),u=Error(`Gemini HTTP ${d.status}: ${m.slice(0,2e3)}`);continue}throw Error(`Gemini error: ${d.status} ${m}`)}throw u??Error("Gemini: all configured API keys exhausted or failed")}},62632:(e,t,n)=>{n.d(t,{p:()=>s});var r=n(37857);let o="https://iagjaulxqanwsrlemjwg.supabase.co",a=process.env.SUPABASE_SERVICE_ROLE_KEY??"";if(!o||!a)throw Error("SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL must be set for admin operations");let s=(0,r.eI)(o,a,{auth:{persistSession:!1,autoRefreshToken:!1}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),r=t.X(0,[8948,5972,7857],()=>n(79745));module.exports=r})();