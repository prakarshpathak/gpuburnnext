import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, blogPosts } from "@/lib/content/blog-posts";
import { generateArticleSchema, serializeSchema } from "@/lib/seo/structured-data";
import BlogPostClient from "@/components/BlogPostClient";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | cheapestGPU Blog`,
    description: post.description,
    keywords: [
      ...post.title.toLowerCase().split(' '),
      'gpu pricing',
      'cloud gpu',
      'ml infrastructure',
      'ai compute',
      'gpu rental',
    ],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://cheapestgpu.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified || post.datePublished,
      authors: [post.author],
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Generate structured data
  const structuredData = generateArticleSchema({
    title: post.title,
    description: post.description,
    author: post.author,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    url: `https://cheapestgpu.com/blog/${slug}`,
    imageUrl: '/og-image.png',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(structuredData) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
