import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Navbar from '@/components/Navbar'

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
        ...data
      }
    }
  }
}

export default function Post({ postData }) {
  return (
    <>
      <Navbar />
      <article className="prose lg:prose-xl p-6 max-w-3xl mx-auto">
        <h1>{postData.title}</h1>
        <p className="text-gray-500 text-sm">{postData.date}</p>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </>
  )
}
