import React, { PropsWithChildren, useMemo, useState } from 'react'
import { IronSessionData } from 'iron-session/edge'
import Link from 'next/link'
import ActiveLink from '@/components/ActiveLink'

const DesktopMenuEntry = ({
  children,
  link,
}: PropsWithChildren<{ link: string }>): JSX.Element => {
  return (
    <li className="hover:text-indigo-700 cursor-pointer h-full flex items-center text-sm text-gry-800 mr-10 tracking-normal">
      <ActiveLink activeClassName={'font-bold'} href={link}>
        {children}
      </ActiveLink>
    </li>
  )
}
// Create type for { user, pageTitle }
type Props = {
  session: IronSessionData
  pageTitle: string
}

export default function Layout({
  children,
  props,
}: PropsWithChildren<{ props: Props }>) {
  const [profile, setProfile] = useState(false)

  const {
    session: { user },
    pageTitle,
  } = props

  const menuEntries = useMemo(
    () => [
      {
        link: '/books',
        title: 'Books',
      },
      {
        link: '/authors',
        title: 'Authors',
      },
    ],
    []
  )
  return (
    <>
      <div className="bg-gray-200 pb-10 min-h-screen">
        {/* Navigation starts */}
        <nav className="w-full mx-auto bg-white shadow relative z-20">
          <div className="justify-between container px-6 h-16 flex items-center lg:items-stretch mx-auto">
            <div className="flex items-center">
              <div className="mr-10 flex items-center">
                <h3 className="text-base text-gray-800 font-bold tracking-normal leading-tight ml-3 hidden lg:block">
                  Logo
                </h3>
              </div>
              <ul className="pr-32 xl:flex hidden items-center h-full">
                {menuEntries.map((entry, index) => (
                  <DesktopMenuEntry key={index} link={entry.link}>
                    {entry.title}
                  </DesktopMenuEntry>
                ))}
              </ul>
            </div>
            <div className="h-full xl:flex hidden items-center justify-end">
              <div className="h-full flex items-center">
                <div className="w-32 pr-16 h-full flex items-center justify-end border-r" />
                <div className="w-full h-full flex">
                  <div
                    aria-haspopup="true"
                    className="cursor-pointer w-full flex items-center justify-end relative"
                    onClick={() => setProfile(!profile)}
                  >
                    {profile ? (
                      <ul className="p-2 w-40 border-r bg-white absolute rounded z-40 left-0 shadow mt-64 ">
                        <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                          <div className="flex items-center">
                            <span className="ml-2">My Profile</span>
                          </div>
                        </li>
                        <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none flex items-center">
                          <Link href={'/logout'}>
                            <span className="ml-2">Logout</span>
                          </Link>
                        </li>
                      </ul>
                    ) : (
                      ''
                    )}
                    {user && (
                      <>
                        <img
                          className="rounded-full h-10 w-10 object-cover"
                          src="http://placekitten.com/40/40"
                          alt="avatar"
                        />
                        <p className="text-gray-800 text-sm ml-2">
                          {user.username}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {/* Navigation ends */}
        {/* Page title starts */}
        <div className="bg-gray-800 pt-8 pb-16 relative z-10">
          <div className="container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-col flex lg:flex-row items-start lg:items-center">
              <div className="ml-0 lg:ml-10 my-6 lg:my-0">
                <h4 className="text-2xl font-bold leading-tight text-white mb-2">
                  {pageTitle}
                </h4>
                <p className="flex items-center text-gray-300 text-xs">
                  {/*<span>Portal</span>*/}
                  {/*<span className="mx-2">&gt;</span>*/}
                  {/*<span>Dashboard</span>*/}
                  {/*<span className="mx-2">&gt;</span>*/}
                  {/*<span>KPIs</span>*/}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Page title ends */}
        <div className="container px-6 mx-auto">
          {/* Remove class [ h-64 ] when adding a card block */}
          <div className="rounded shadow relative bg-white z-10 -mt-8 mb-8 w-full h-64">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
