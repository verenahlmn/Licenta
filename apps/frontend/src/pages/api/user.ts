// pages/api/user.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute } from '@/lib/withSession'
import { User } from '@/types/User'

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<User | null>
) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      ...req.session.user,
    })
  } else {
    res.redirect('/logout')
    // res.json(null)
  }
}

export default withSessionRoute(userRoute)
