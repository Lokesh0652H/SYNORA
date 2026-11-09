import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function GET(request:Request){const url=new URL(request.url),code=url.searchParams.get('code'),next=url.searchParams.get('next')||'/dashboard';if(code&&process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY){const jar=await cookies();const db=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>jar.getAll(),setAll:items=>items.forEach(({name,value,options})=>jar.set(name,value,options))}});await db.auth.exchangeCodeForSession(code);}return NextResponse.redirect(new URL(next,url.origin));}
