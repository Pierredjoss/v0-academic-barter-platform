import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === 'undefined') return []
          return document.cookie
            .split(';')
            .map((cookie) => cookie.trim())
            .filter(Boolean)
            .map((cookie) => {
              const [name, ...valueParts] = cookie.split('=')
              const value = valueParts.join('=')
              return { name, value }
            })
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') return

          cookiesToSet.forEach(({ name, value, options }) => {
            let cookie = `${name}=${value}`

            if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`
            if (options?.expires) cookie += `; Expires=${options.expires.toUTCString()}`
            cookie += `; Path=${options?.path ?? '/'}`
            if (options?.domain) cookie += `; Domain=${options.domain}`

            const sameSite = options?.sameSite
            if (sameSite) cookie += `; SameSite=${sameSite}`
            if (options?.secure) cookie += '; Secure'

            document.cookie = cookie
          })
        },
      },
    }
  )
}
