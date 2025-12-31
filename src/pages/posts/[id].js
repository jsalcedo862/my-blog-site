import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function PostPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

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
      }

      setLoading(false)
    }

    fetchPost()
  }, [id])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!post) {
    return <div className="p-6">Post not found.</div>
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />

      <main className="prose lg:prose-xl max-w-3xl mx-auto p-6 flex-grow">
        {post.image && (
          <div className="w-full max-w-md mx-auto mb-6">
            <Image
              src={post.image}
              alt={`Banner for ${post.title}`}
              width={800}
              height={400}
              className="rounded-lg w-full h-auto"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold">{post.title}</h1>

        {post.record_label && (
          <p className="text-lg text-gray-700 mt-2">
            <span className="font-medium">Record Label:</span> {post.record_label}
          </p>
        )}

        {post.release_date && (
          <p className="text-lg text-gray-700">
            <span className="font-medium">Release Date:</span>{' '}
            {new Date(post.release_date).toLocaleDateString()}
          </p>
        )}

        <p className="text-sm text-gray-500 mt-2 mb-6">
          Published: {new Date(post.date).toLocaleDateString()}
        </p>

        <div className="prose max-w-none">
          {post.content}
        </div>

        {post.music_link && (
          <a
            href={post.music_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mt-6"
          >
            🎧 Listen
          </a>
        )}
      </main>

      <Footer />
    </div>
  )
}
