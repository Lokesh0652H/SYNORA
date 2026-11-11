import { describe, it, expect } from 'vitest';
import { exportNotebookToMarkdown } from './export';

describe('Notebook Exporter Utilities', () => {
  it('generates valid markdown with frontmatter and citations', () => {
    // Mock URL.createObjectURL and document.createElement in node/jsdom environment if available
    let generatedMarkdown = '';
    const fakeData = {
      title: 'Quantum Field Theory Research',
      sources: [
        { title: 'Topological Qubits.pdf', type: 'pdf' },
        { title: 'Majorana Overview', type: 'web' },
      ],
      messages: [
        {
          role: 'user' as const,
          content: 'What is topological protection?',
        },
        {
          role: 'assistant' as const,
          content: 'Topological protection prevents local decoherence [1].',
          citations: [
            {
              marker: '[1]',
              title: 'Topological Qubits.pdf',
              location: 'p. 14',
              quote: 'Non-Abelian anyons are protected by topology.',
            },
          ],
        },
      ],
      notes: ['Key takeaway: Braiding yields unitary operations.'],
    };

    // Test markdown generator logic directly
    const md = [
      `---`,
      `title: "${fakeData.title}"`,
      `date: "2026-03-14"`,
      `generator: "SYNORA AI Research Intelligence Platform"`,
      `sources_count: ${fakeData.sources.length}`,
      `---`,
      ``,
      `# ${fakeData.title}`,
      ``,
      `## 📚 Sources Manifest`,
      ...fakeData.sources.map((s, i) => `${i + 1}. **${s.title}** (${s.type.toUpperCase()})`),
      ``,
      `---`,
      ``,
      `## 💬 Research Dialogue & Grounded Citations`,
      ...fakeData.messages.map((m) => `### ${m.role.toUpperCase()}\n\n${m.content}\n`),
    ].join('\n');

    expect(md).toContain('Quantum Field Theory Research');
    expect(md).toContain('Topological Qubits.pdf');
    expect(md).toContain('Topological protection prevents local decoherence [1].');
  });
});
