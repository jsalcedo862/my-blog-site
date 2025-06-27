import Navbar from '@/components/Navbar'
import { getSortedPostsData } from '@/../lib/posts'
import Image from 'next/image'
import Footer from '@/components/Footer'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return { props: { allPostsData } }
}

export default function Spotlight({ allPostsData }) {
  return (
    <>
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Spotlight</h1>

        <div className="flex flex-col gap-6">
          {allPostsData.map(({ id, title, date, image, recordLabel, releaseDate }) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <a href={`/posts/${id}`} className="block sm:flex">
                {image && (
                  <Image
                    src={image}
                    alt={`Banner for ${title}`}
                    width={160}
                    height={120}
                    className="w-full sm:w-60 h-40 object-cover sm:object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>

                  {recordLabel && (
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-semibold font-medium">Record Label:</span> {recordLabel}
                    </p>
                  )}

                  {releaseDate && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold font-medium">Release Date:</span> {new Date(releaseDate).toLocaleDateString()}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(date).toLocaleDateString()}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
