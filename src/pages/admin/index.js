import { useEffect, useState } from 'react'
import { supabase } from '@/../lib/supabaseClient'
import Link from 'next/link'

export default function AdminDashboard() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data)
      }
    }

    fetchPosts()
  }, [])

  const deletePost = async (id) => {
    //console.log('Deleting post with ID:', id)
    if (confirm('Are you sure you want to delete this post?')) {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) {
        alert('Error deleting post:', error.message)
      } else {
        setPosts(posts.filter(post => post.id !== id))
      }
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Link href="/admin/new" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6">
        ➕ New Post
      </Link>

      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-4">
                {/* ✅ Edit link now points correctly to dynamic [id] */}
                <Link href={`/admin/edit/${post.id}`} className="text-blue-600 hover:underline">
                  ✏️ Edit
                </Link>
                <button onClick={() => deletePost(post.id)} className="text-red-600 hover:underline">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
