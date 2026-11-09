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
 throw new Error('This version accepts PDF, DOCX, TXT, and Markdown files.');
}
