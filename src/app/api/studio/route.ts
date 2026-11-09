import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';
import { genAI, chatModel } from '@/lib/ai';

const bodySchema = z.object({
  notebookId: z.string().uuid(),
  kind: z.enum([
    'guide',
    'flashcards',
    'quiz',
    'faq',
    'mindmap',
    'timeline',
    'compare',
    'contradiction',
    'perspectives',
    'action_report',
    'action_roadmap',
  ]),
});

const prompts: Record<string, string> = {
  guide: 'Create a comprehensive, structured study guide with key takeaways and cited principles.',
  flashcards: 'Create 10 rigorous active-recall question and answer cards based strictly on the sources.',
  quiz: 'Create 8 challenging multiple-choice and conceptual assessment questions with answers and rationales.',
  faq: 'Create an authoritative FAQ addressing the most critical questions and edge cases in the material.',
  mindmap: 'Create a connected Knowledge Graph mapping core concepts, entities, technologies, and relational links.',
  timeline: 'Create a chronological timeline of developments, findings, and milestones strictly supported by the text.',
  compare: 'Compare and contrast conflicting arguments, methodologies, and findings across the sources.',
  contradiction:
    'Perform Contradiction & Claim Verification: Identify any conflicting statements, unverified assumptions, or opposing evidence across the uploaded documents. For each contradiction, state the conflicting claims and cite the text.',
  perspectives:
    'Generate Multiple AI Research Perspectives: Provide analysis from 5 distinct angles:\n1. Researcher (deep empirical inquiry)\n2. Critical Thinker (challenge assumptions & identify weaknesses)\n3. Analyst (patterns, trends, and correlations)\n4. Teacher (simple, intuitive breakdown of complex ideas)\n5. Strategist (actionable recommendations)\nConclude with a Consensus Summary.',
  action_report:
    'Execute Knowledge-to-Action (Research-to-Report): Transform the source documents into an executive decision-ready report with Executive Summary, Key Findings, Risk Assessment, and Cited Recommendations.',
  action_roadmap:
    'Execute Knowledge-to-Action (Research-to-Roadmap): Convert the findings into a phased implementation roadmap with milestones, dependencies, deliverables, and verifiable checkpoints.',
};

export async function POST(req: Request) {
  const db = await supabaseServer();
  if (!db) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Choose a valid notebook and studio tool.' }, { status: 400 });

  const { data: book } = await db.from('notebooks').select('id').eq('id', parsed.data.notebookId).single();
  if (!book) return NextResponse.json({ error: 'Notebook not found.' }, { status: 404 });

  const { data: chunks } = await db.from('document_chunks').select('content').eq('notebook_id', book.id).limit(40);
  if (!chunks?.length) return NextResponse.json({ error: 'Add an indexed source document first.' }, { status: 422 });

  try {
    const contents = chunks.map((x: any) => x.content).join('\n\n').slice(0, 30000);
    const result = await genAI().models.generateContent({
      model: chatModel(),
      contents: `You are SYNORA, an elite AI research and knowledge synthesis intelligence. Use only the supplied source text. Do not invent facts, citations, or dates.\n\nOBJECTIVE:\n${prompts[parsed.data.kind]}\n\nSOURCE EXCERPTS:\n${contents}`,
    });

    const content = result.text || '';
    const { data, error } = await db
      .from('study_materials')
      .insert({ user_id: user.id, notebook_id: book.id, kind: parsed.data.kind, payload: { content } })
      .select('id,kind,payload,created_at')
      .single();

    if (error) throw new Error('Could not persist synthesis material.');
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error('Study generation failed', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Could not generate study material.' }, { status: 502 });
  }
}
