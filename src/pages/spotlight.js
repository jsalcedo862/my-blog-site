import Navbar from '@/components/Navbar'
import { getSortedPostsData } from '@/../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return { props: { allPostsData } }
}

export default function Spotlight({ allPostsData }) {
  return (
    <>
      <Navbar />
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Spotlight Blog</h1>
        <ul className="space-y-4">
          {allPostsData.map(({ id, title, date }) => (
            <li key={id}>
              <a href={`/posts/${id}`} className="text-blue-600 text-xl hover:underline">{title}</a>
              <p className="text-gray-500 text-sm">{date}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

