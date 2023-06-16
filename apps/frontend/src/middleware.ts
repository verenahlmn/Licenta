// /middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session/edge'
import { ironOptions } from '@/lib/config'

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const session = await getIronSession(req, res, ironOptions)

  // do anything with session here:
  const token = session.token

  // Fetcher.defaults.baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
  // const { data: userInfo } = await Fetcher.get<User>(
  //   '/api/users/me?populate=*',
  //   {
  //     token: session.token,
  //   }
  // )
  // console.log('userInfo', userInfo)
  // if (userInfo) {
  //   session.user = userInfo
  //   session.token = token
  //   await session.save()
  // } else {
  //   await session.destroy()
  //   return NextResponse.redirect(new URL('/logout', req.url))
  // }

  // demo:
  if (!token) {
    // unauthorized to see pages inside admin/
    return NextResponse.redirect(new URL('/login', req.url)) // redirect to /unauthorized page
  }

  return res
}

export const config = {
  matcher: ['/', '/books'],
}
