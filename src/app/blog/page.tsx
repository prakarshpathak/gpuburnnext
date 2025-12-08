import { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/content/blog-posts";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | cheapestGPU",
  description: "Expert guides, comparisons, and insights on GPU cloud pricing, AI infrastructure optimization, and machine learning compute costs.",
  keywords: [
    "gpu blog",
    "cloud gpu guides",
    "ai infrastructure",
    "ml compute costs",
    "gpu pricing guides",
    "machine learning blog",
  ],
  openGraph: {
    title: "Blog | cheapestGPU",
    description: "Expert guides and insights on GPU cloud pricing and AI infrastructure.",
    url: "https://cheapestgpu.com/blog",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "cheapestGPU Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | cheapestGPU",
    description: "Expert guides and insights on GPU cloud pricing and AI infrastructure.",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen text-foreground p-4 md:p-6 lg:p-12 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <Navbar />

        <div className="mt-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-pixelify">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert guides, comparisons, and insights on GPU cloud pricing and AI infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full p-6 border border-border hover:border-primary transition-colors cursor-pointer group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(post.datePublished).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
