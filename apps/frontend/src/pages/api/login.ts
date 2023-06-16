// pages/api/login.ts

import { withSessionRoute } from '@/lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'
import Fetcher, { FetcherResponse } from '@/utils/fetcher'

export default withSessionRoute(loginRoute)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req
  if (method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const { username, password } = body
  if (!username || !password) {
    res.status(400).json({ errorMessage: 'Missing username or password' })
    return
  }

  let loginResponse: FetcherResponse<any, any>
  try {
    loginResponse = await Fetcher.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/local`,
      {
        identifier: username,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (e: any) {
    res.status(500).send(e.response)
    return
  }

  console.log('loginResponse', loginResponse.data)
  if (!loginResponse.data.jwt) {
    res.status(401).json({ errorMessage: 'Invalid credentials' })
    return
  }
  // get user from database then:
  req.session.token = loginResponse.data.jwt
  req.session.user = loginResponse.data.user
  await req.session.save()
  res.redirect(302, '/')
}
