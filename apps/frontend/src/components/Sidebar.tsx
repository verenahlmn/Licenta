import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

type MenuEntryProps = {
  label: string
  icon?: string
  link: string
  suffix?: string | number
}

function MenuEntry(props: MenuEntryProps) {
  const router = useRouter()
  const { label, icon, suffix, link } = props
  const isActive = router.pathname.includes(link)

  return (
    <Link href={link}>
      <div
        className={`flex px-3 py-2 rounded-lg items-center justify-between ${
          isActive ? 'bg-primary-400' : ''
        }`}
      >
        <div className="flex gap-3">
          {icon && <Image src={icon} height={16} width={20} alt={label} />}
          <p
            className={`text-base ${
              isActive ? 'text-white' : 'text-primary-400'
            }`}
          >
            {label}
          </p>
        </div>
        {suffix && (
          <div className="bg-neutrals-200 flex px-2 py-1 rounded-lg">
            <p className="text-primary-400 text-xs">{suffix}</p>
          </div>
        )}
      </div>
    </Link>
  )
}

export default function Sidebar() {
  const links = [
    {
      label: 'Cartile mele',
      link: '/books',
    },
    {
      label: 'Cautare',
      link: '/search',
    },
  ]

  return (
    <>
      {/* Sidebar starts */}
      {/* Remove class [ hidden ] and replace [ sm:flex ] with [ flex ] */}
      <div className="w-64 absolute sm:relative shadow md:h-screen flex-col justify-between flex bg-white">
        <div className="px-4">
          <div className="h-16 w-full flex items-center justify-center px-8">
            <h1>Logo</h1>
          </div>
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <MenuEntry key={link.link} {...link} />
            ))}
          </div>
        </div>
      </div>
      {/* Sidebar ends */}
    </>
  )
}
