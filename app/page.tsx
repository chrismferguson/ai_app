import { auth } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  const {userId} = await auth()
  let href = userId ? '/journal' : '/new-user'
  
  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl mb-4">Overcome burnout by journaling</h1>
        <p className="text-2xl text-white/60 mb-4">Each day write a journal entry and have AI detect signs of burnout. See the signs before it's too late.</p>
        <div>
          <Link href={href}>
          <button className="bg-orange-500 border-2 border-blue-500 px-4 py-2 rounded-full text-xl">start journaling
          </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
