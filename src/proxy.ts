import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request:NextRequest){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!anon)return NextResponse.next({request});
 let response=NextResponse.next({request});
 const supabase=createServerClient(url,anon,{cookies:{getAll:()=>request.cookies.getAll(),setAll(items){items.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});items.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
 const {data:{user}}=await supabase.auth.getUser();
 if(request.nextUrl.pathname.startsWith('/dashboard')||request.nextUrl.pathname.startsWith('/notebook')||request.nextUrl.pathname.startsWith('/settings')){if(!user){const target=request.nextUrl.clone();target.pathname='/login';target.searchParams.set('next',request.nextUrl.pathname);return NextResponse.redirect(target);}}
 return response;
}
export const config={matcher:['/dashboard/:path*','/notebook/:path*','/settings/:path*']};
