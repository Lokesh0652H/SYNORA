import { Document, Paragraph, TextRun, HeadingLevel, Packer, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import jsPDF from 'jspdf';

export interface ExportNotebookData {
  title: string;
  description?: string;
  sources: Array<{ title: string; type: string; page_count?: number }>;
  messages: Array<{ role: string; content: string; citations?: any[] }>;
  notes: Array<{ title: string; content: string }>;
  studyMaterials?: Array<{ kind: string; data: any }>;
}

function sanitizeFileName(title: string): string {
  return (title || 'SYNORA_Research')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 50);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 1. Export to Microsoft Word (.docx)
 */
export async function exportNotebookToDocx(data: ExportNotebookData) {
  const children: Paragraph[] = [
    // Header Title
    new Paragraph({
      text: 'SYNORA RESEARCH DOSSIER',
      heading: HeadingLevel.TITLE,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: data.title, bold: true, size: 32, color: '20201D' }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on ${new Date().toLocaleDateString()} · Sovereign Intelligence Perimeter`,
          italics: true,
          size: 20,
          color: '666666',
        }),
      ],
      spacing: { after: 240 },
    }),

    // Section 1: Ingested Sources
    new Paragraph({
      text: '1. Ingested Research Sources',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
    }),
  ];

  if (data.sources.length === 0) {
    children.push(
      new Paragraph({ text: 'No external sources indexed.', spacing: { after: 120 } })
    );
  } else {
    data.sources.forEach((src) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `• ${src.title}`, bold: true }),
            new TextRun({
              text: ` (${src.type.toUpperCase()}${src.page_count ? `, ${src.page_count} pages` : ''})`,
              color: '555555',
            }),
          ],
          spacing: { after: 60 },
        })
      );
    });
  }

  // Section 2: Grounded Conversation & Citations
  children.push(
    new Paragraph({
      text: '2. Grounded Research Synthesis & Dialogue',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
    })
  );

  data.messages.forEach((msg) => {
    const isUser = msg.role === 'user';
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: isUser ? 'RESEARCHER:' : 'SYNORA INTELLIGENCE:',
            bold: true,
            color: isUser ? '20201D' : '2D5A43',
          }),
        ],
        spacing: { before: 120, after: 40 },
      })
    );
    children.push(
      new Paragraph({
        text: msg.content,
        spacing: { after: 80 },
      })
    );
  });

  // Section 3: Notes
  if (data.notes && data.notes.length > 0) {
    children.push(
      new Paragraph({
        text: '3. Research Notes & Insights',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
      })
    );

    data.notes.forEach((note) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: note.title, bold: true })],
          spacing: { before: 80, after: 40 },
        })
      );
      children.push(
        new Paragraph({
          text: note.content,
          spacing: { after: 80 },
        })
      );
    });
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const buffer = await Packer.toBlob(doc);
  const filename = `${sanitizeFileName(data.title)}_SYNORA.docx`;
  triggerDownload(buffer, filename);
}

/**
 * 2. Export to PDF (.pdf)
 */
export function exportNotebookToPdf(data: ExportNotebookData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;
  let cursorY = 50;

  // Header
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(32, 32, 29);
  doc.text('SYNORA RESEARCH DOSSIER', margin, cursorY);
  cursorY += 24;

  doc.setFontSize(14);
  doc.setFont('times', 'normal');
  doc.text(data.title, margin, cursorY);
  cursorY += 16;

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 110);
  doc.text(`Generated: ${new Date().toLocaleDateString()} · Sovereign Grounded Intelligence`, margin, cursorY);
  cursorY += 20;

  // Divider
  doc.setDrawColor(220, 215, 205);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 20;

  // Sources
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(32, 32, 29);
  doc.text('1. Ingested Sources', margin, cursorY);
  cursorY += 16;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 55);

  if (data.sources.length === 0) {
    doc.text('No sources indexed.', margin, cursorY);
    cursorY += 16;
  } else {
    data.sources.forEach((s) => {
      const line = `• ${s.title} (${s.type.toUpperCase()}${s.page_count ? `, ${s.page_count} pgs` : ''})`;
      doc.text(line, margin, cursorY);
      cursorY += 14;
    });
  }

  cursorY += 14;

  // Q&A Dialogue
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(32, 32, 29);
  doc.text('2. Research Dialogue & Synthesized Claims', margin, cursorY);
  cursorY += 16;

  data.messages.forEach((msg) => {
    // Check page boundaries
    if (cursorY > 740) {
      doc.addPage();
      cursorY = 50;
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(msg.role === 'user' ? 32 : 45, msg.role === 'user' ? 32 : 90, msg.role === 'user' ? 29 : 67);
    doc.text(msg.role === 'user' ? 'RESEARCHER:' : 'SYNORA INTELLIGENCE:', margin, cursorY);
    cursorY += 12;

    doc.setFont('times', 'normal');
    doc.setTextColor(50, 50, 45);
    const lines = doc.splitTextToSize(msg.content, maxLineWidth);
    lines.forEach((l: string) => {
      if (cursorY > 760) {
        doc.addPage();
        cursorY = 50;
      }
      doc.text(l, margin, cursorY);
      cursorY += 12;
    });

    cursorY += 8;
  });

  const filename = `${sanitizeFileName(data.title)}_SYNORA.pdf`;
  doc.save(filename);
}

/**
 * 3. Export to Markdown (.md)
 */
export function exportNotebookToMarkdown(data: ExportNotebookData) {
  const parts: string[] = [
    '---',
    `title: "${data.title}"`,
    `date: "${new Date().toISOString()}"`,
    `sources_count: ${data.sources.length}`,
    'generator: "SYNORA Sovereign Intelligence"',
    '---',
    '',
    `# ${data.title}`,
    '',
    data.description ? `> ${data.description}\n` : '',
    '## 1. Ingested Research Sources',
    '',
  ];

  if (data.sources.length === 0) {
    parts.push('No sources indexed.\n');
  } else {
    data.sources.forEach((s) => {
      parts.push(`- **${s.title}** (${s.type.toUpperCase()}${s.page_count ? `, ${s.page_count} pages` : ''})`);
    });
    parts.push('');
  }

  parts.push('## 2. Research Dialogue & Citations\n');
  data.messages.forEach((m) => {
    parts.push(`### ${m.role === 'user' ? 'Researcher' : 'SYNORA Intelligence'}\n`);
    parts.push(`${m.content}\n`);
  });

  if (data.notes && data.notes.length > 0) {
    parts.push('## 3. Saved Research Notes\n');
    data.notes.forEach((n) => {
      parts.push(`### ${n.title}\n`);
      parts.push(`${n.content}\n`);
    });
  }

  const blob = new Blob([parts.join('\n')], { type: 'text/markdown;charset=utf-8' });
  const filename = `${sanitizeFileName(data.title)}_SYNORA.md`;
  triggerDownload(blob, filename);
}
