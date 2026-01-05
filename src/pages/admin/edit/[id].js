import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/../lib/supabaseClient'

function EditPost() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [image, setImage] = useState('')
  const [recordLabel, setRecordLabel] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [musicLink, setMusicLink] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!id) return

    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching post:', error)
      } else {
        setPost(data)
        setTitle(data.title)
        setDate(data.date)
        setImage(data.image)
        setRecordLabel(data.record_label)
        setReleaseDate(data.release_date)
        setMusicLink(data.music_link)
        setContent(data.content)
      }

      setLoading(false)
    }

    fetchPost()
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        date,
        image,
        record_label: recordLabel,
        release_date: releaseDate,
        music_link: musicLink,
        content
      })
      .eq('id', id)

    console.log('Updating post with ID:', id)


    if (error) {
      console.error('Error updating post:', error)
      alert('Error updating post: ' + error.message)
    } else {
      alert('Post updated!')
      router.push('/admin')
    }
  }

  if (loading) return <p className="p-6">Loading post...</p>
  if (!post) return <p className="p-6">Post not found.</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Record Label"
          value={recordLabel}
          onChange={e => setRecordLabel(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          placeholder="Release Date"
          value={releaseDate || ''}
          onChange={e => setReleaseDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Music Link"
          value={musicLink}
          onChange={e => setMusicLink(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full p-2 border rounded min-h-[200px]"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}


export default function EditPostPage() {
  return (
    <ProtectedRoute>
      <EditPost />
    </ProtectedRoute>
  )
}