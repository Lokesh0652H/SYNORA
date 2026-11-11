export function splitIntoChunks(text:string,size=1200,overlap=180){
 const clean=text.replace(/\r/g,'').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
 const out:string[]=[];let start=0;
 while(start<clean.length){let end=Math.min(start+size,clean.length);if(end<clean.length){const boundary=Math.max(clean.lastIndexOf('\n',end),clean.lastIndexOf('. ',end),clean.lastIndexOf(' ',end-size*.2));if(boundary>start)end=boundary+1;}const part=clean.slice(start,end).trim();if(part)out.push(part);if(end>=clean.length)break;start=Math.max(start+1,end-overlap);}
 return out;
}
export async function extractText(file:File):Promise<{text:string;pages?:number;pageTexts?:string[]}>{
 const ext=file.name.split('.').pop()?.toLowerCase();
 if(ext==='txt'||ext==='md')return {text:await file.text()};
 const bytes=Buffer.from(await file.arrayBuffer());
 if(ext==='pdf'){const {PDFParse}=await import('pdf-parse');const parser=new PDFParse({data:bytes});try{const result=await parser.getText();return {text:result.text,pages:result.total,pageTexts:result.pages.map(p=>p.text)};}finally{await parser.destroy();}}
 if(ext==='docx'){const mammoth=await import('mammoth');const result=await mammoth.extractRawText({buffer:bytes});return {text:result.value};}
 if(ext==='pptx'){
  try {
   const JSZip = (await import('jszip')).default;
   const zip = await JSZip.loadAsync(bytes);
   const slideTexts: string[] = [];
   const slideFiles = Object.keys(zip.files).filter(k => k.startsWith('ppt/slides/slide') && k.endsWith('.xml'));
   slideFiles.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '') || '0', 10);
    const numB = parseInt(b.replace(/\D/g, '') || '0', 10);
    return numA - numB;
   });
   for (const slidePath of slideFiles) {
    const xml = await zip.files[slidePath].async('text');
    const matches = Array.from(xml.matchAll(/<a:t[^>]*>([^<]+)<\/a:t>/g)).map(m => m[1]);
    const slideContent = matches.join(' ').trim();
    if (slideContent) slideTexts.push(slideContent);
   }
   const combined = slideTexts.join('\n\n');
   return {
    text: combined || `[Presentation: ${file.name}]`,
    pages: Math.max(1, slideFiles.length),
    pageTexts: slideTexts.length > 0 ? slideTexts : [file.name],
   };
  } catch {
   return { text: `[Presentation: ${file.name}]`, pages: 1 };
  }
 }
 if(['png', 'jpg', 'jpeg', 'webp'].includes(ext||'')){
  return {
   text: `[Visual Asset: ${file.name}] Uploaded visual research reference.`,
   pages: 1,
   pageTexts: [`Image document: ${file.name}`],
  };
 }
 throw new Error('This version accepts PDF, DOCX, PPTX, TXT, Markdown, and Images.');
}
