import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getStaticPaths() {
  const filenames = fs.readdirSync(postsDirectory)

  const paths = filenames.map(filename => ({
    params: {
      id: filename.replace(/\.md$/, '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const fullPath = path.join(postsDirectory, `${params.id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const { data, content } = matter(fileContents)

  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    props: {
      postData: {
        id: params.id,
        contentHtml,
        ...data,
      }
    }
  }
}

export default function Post({ postData }) {
  const { title, date, image, recordLabel, releaseDate, contentHtml, musicLink } = postData

  return (
    <>
      <Navbar />
      <article className="prose lg:prose-xl max-w-3xl mx-auto p-6">
        {image && (
          <div className="w-full max-w-md mx-auto mb-6">
            <Image
              src={image}
              alt={`Banner for ${title}`}
              width={800}
              height={400}
              className="rounded-lg w-full h-auto"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold">{title}</h1>

        {recordLabel && (
          <p className="text-lg text-gray-700 mt-2">
            <span className="font-medium">Record Label:</span> {recordLabel}
          </p>
        )}

        {releaseDate && (
          <p className="text-lg text-gray-700">
            <span className="font-medium">Release Date:</span>{" "}
            {new Date(releaseDate).toLocaleDateString()}
          </p>
        )}

        <p className="text-sm text-gray-500 mt-2 mb-6">
          Published: {new Date(date).toLocaleDateString()}
        </p>

        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

        {musicLink && (
          <a
            href={musicLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mt-6"
          >
            🎧 Listen
          </a>
        )}
      </article>
    </>
  );
}
