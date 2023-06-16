import Layout from '@/components/Layout'
import { withSessionSsr } from '@/lib/withSession'
import { FC } from 'react'
import { InferGetServerSidePropsType } from 'next'

const BookPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  return (
    <Layout props={props}>
      <h1>Author</h1>
    </Layout>
  )
}

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  return {
    props: {
      pageTitle: 'Carte',
      session: req.session,
    },
  }
})

export default BookPage
