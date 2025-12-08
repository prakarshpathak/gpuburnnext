"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/lib/content/blog-posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen text-foreground p-4 md:p-6 lg:p-12 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <Navbar />

        <article className="space-y-6">
          {/* Header */}
          <header className="space-y-4 pb-8 border-b border-border">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="capitalize">
                {post.category}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.datePublished).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-4xl font-bold mb-6 mt-8 text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="text-3xl font-bold mb-4 mt-8 text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="text-2xl font-bold mb-3 mt-6 text-foreground">{children}</h3>,
                h4: ({ children }) => <h4 className="text-xl font-bold mb-2 mt-4 text-foreground">{children}</h4>,
                p: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr className="border-b border-border">{children}</tr>,
                th: ({ children }) => (
                  <th className="border border-border p-3 text-left font-semibold text-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border p-3 text-muted-foreground">
                    {children}
                  </td>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
                  const isInline = !className;

                  if (isInline) {
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-muted p-4 rounded my-4 overflow-x-auto text-sm font-mono text-foreground">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded my-4 overflow-x-auto">
                    {children}
                  </pre>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer CTA */}
          <div className="pt-12 border-t border-border">
            <div className="bg-muted/30 rounded-xl p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Compare GPU Prices?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Use our real-time price comparison tool to find the best GPU rental deals across 15+ providers.
              </p>
              <Button
                onClick={() => router.push('/')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Compare Prices Now
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
