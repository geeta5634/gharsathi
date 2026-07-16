import { NextResponse } from 'next/server'

export async function updateSession(request) {
  const supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  try {
    const { createServerClient } = await import('@supabase/ssr')
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set(name, value)
          supabaseResponse.cookies.set(name, value, options)
        },
        remove(name, options) {
          supabaseResponse.cookies.set(name, '', options)
        },
      },
    })

    await supabase.auth.getUser()
  } catch (e) {
    console.warn('Supabase middleware error:', e.message)
  }

  return supabaseResponse
}
