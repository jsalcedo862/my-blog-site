// lib/getPostsFromSupabase.js
import { supabase } from './supabaseClient'

export async function getPostsFromSupabase() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false })

  //console.log('Raw Supabase Data:', data)
  //console.error('Supabase Error:', error)    

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data.map(post => ({
    id: post.id,
    title: post.title,
    date: post.date,
    image: post.image,
    recordLabel: post.record_label,
    releaseDate: post.release_date,
    musicLink: post.music_link,
    content: post.content,   
  }))
}
