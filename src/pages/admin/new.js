import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/../lib/supabaseClient'

export default function NewPost() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    date: '',
    record_label: '',
    release_date: '',
    content: '',
    music_link: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.from('posts').insert([
      {
        ...formData,
        date: new Date(formData.date).toISOString(),
        release_date: formData.release_date ? new Date(formData.release_date).toISOString() : null,
      }
    ])

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin') // Redirect to dashboard
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">➕ New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image path (e.g. /images/yourfile.jpg)"
          className="w-full border p-2 rounded"
          value={formData.image}
          onChange={handleChange}
        />

        <label className="block mb-2">
        <span className="text-gray-700">Publish Date</span>
        <input
          type="date"
          name="date"
          placeholder="Publish Date"
          className="w-full border p-2 rounded"
          value={formData.date}
          onChange={handleChange}
          required
        />
        </label>

        <input
          type="text"
          name="record_label"
          placeholder="Record Label"
          className="w-full border p-2 rounded"
          value={formData.record_label}
          onChange={handleChange}
        />

        <label className="block mb-2 mt-4">
        <span className="text-gray-700">Release Date</span>
        <input
          type="date"
          name="release_date"
          placeholder="Release Date"
          className="w-full border p-2 rounded"
          value={formData.release_date}
          onChange={handleChange}
        />
        </label>

        <textarea
          name="content"
          placeholder="Content (HTML or Markdown)"
          className="w-full border p-2 rounded min-h-[120px]"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="music_link"
          placeholder="Music link (optional)"
          className="w-full border p-2 rounded"
          value={formData.music_link}
          onChange={handleChange}
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}
