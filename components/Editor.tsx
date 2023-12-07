'use client'
import { updateEntry, deleteEntry } from '@/utils/api'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'
import Spinner from './Spinner'
import { useRouter } from 'next/navigation'

const Editor = ({ entry }) => {
  const [text, setText] = useState(entry.content)
  const [currentEntry, setEntry] = useState(entry)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    await deleteEntry(entry.id)
    router.push('/journal')
  }
  useAutosave({
    data: text,
    onSave: async (_text) => {
      if (_text === entry.content) return
      setIsSaving(true)

      const { data } = await updateEntry(entry.id, { content: _text })

      setEntry(data)
      setIsSaving(false)
    },
  })

  return (
    <div className="w-full h-full grid grid-cols-3 gap-0 relative">
      <div className="absolute left-0 top-0 p-2">
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
        )}
      </div>
      <div className="col-span-2 text-black">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full text-xl p-8"
        />
        
      </div>
      <div className="border-l border-black/5">
        <div
          style={{ background: currentEntry && currentEntry.analysis ? currentEntry.analysis.color : 'text-white'  }}
          className="h-[100px] bg-blue-600 text-white p-8"
        >
          <h2 className="text-2xl bg-white/25 text-white">Analysis</h2>
        </div>
        <div>
          <ul role="list" className="divide-y divide-gray-200">
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold w-1/3 text-white">Subject</div>
              <div className="text-xl text-white">{currentEntry && currentEntry.analysis ? currentEntry.analysis.subject: ''}</div>
            </li>

            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold text-white">Mood</div>
              <div className="text-xl text-white">{currentEntry && currentEntry.analysis ? currentEntry.analysis.mood: ''}</div>
            </li>

            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold text-white">Burnout</div>
              <div className="text-xl text-white">
                {currentEntry && currentEntry.analysis ? (currentEntry.analysis.burnout ? 'True' : 'False') : ''}
              </div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <button
                onClick={handleDelete}
                type="button"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete
              </button>
            </li>
            <li className="py-2 px-8 flex items-center justify-between">
                <div className="py-8 text-l font-light text-white">Burnout typically occurs when your input doesn't match the output that you expect. A large part of burnout is the feeling of being out of control. But ask yourself, "Who wants to be in control?" "I do" will be the answer that arises.
                <li className='py-2'>Then ask yourself, "Where am I?" Your ego will say here.</li>
                <li className='py-2'>Follow up with "If I'm here, where is here?"</li>
                <li className='py-2'>Your ego will have no answer. This is self-inquiry. Shine a light on your ego and it will go quiet. </li>
                </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Editor