// pages/api/logout.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute } from '@/lib/withSession'

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy()
  res.redirect(302, '/login')
}

export default withSessionRoute(logoutRoute)
