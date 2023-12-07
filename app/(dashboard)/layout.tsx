import { UserButton } from "@clerk/nextjs"
import Link from 'next/link'

const links = [
    {href: '/', label: 'Home'},
    {href: '/journal', label: 'Journal'},
]

const DashboardLayout = ({children}) => {
    return (
        <div className="h-screen w-screen relative bg-black">
            <aside className="absolute w-[199px] top-0 left-0 h-full border-r white">
                <div className="px-2 py-6 text-xl text-white/50">
                    Burnout Journal 
                </div>
                <ul>
                    {links.map((link) => (
                        <li key={link.href} className="px-2 py-6 text-xl text-white">
                            <Link href={link.href}>{link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="ml-[200px] h-full w-[calc(100vw-200px)]">
                <header className="h-[60px] border-b white">
                    <nav className="px-4 h-full">
                        <div className="h-full w-full px-6 flex items-center justify-end">
                        <UserButton afterSignOutUrl="/" />
                        </div>
                    </nav>
                    </header>
                <div className="h-[calc(100vh-60px)]">{children}</div>
            </div>
        </div>
    )
}

export default DashboardLayout