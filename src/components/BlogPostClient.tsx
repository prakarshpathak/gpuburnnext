"use client";

import { useRouter } from "next/navigation";
import { BlogPost } from "@/lib/content/blog-posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const router = useRouter();

  // Convert content markdown to paragraphs (simple approach)
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('# ')) {
        elements.push(<h1 key={idx} className="text-4xl font-bold mb-6 mt-8">{line.replace('# ', '')}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={idx} className="text-3xl font-bold mb-4 mt-8">{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={idx} className="text-2xl font-bold mb-3 mt-6">{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(<p key={idx} className="font-semibold mb-2 mt-4">{line.replace(/\*\*/g, '')}</p>);
      } else if (line.startsWith('- ')) {
        elements.push(<li key={idx} className="ml-6 mb-1">{line.replace('- ', '')}</li>);
      } else if (line.trim()) {
        elements.push(<p key={idx} className="mb-4 leading-relaxed text-muted-foreground">{line}</p>);
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <ThemeToggle />
        </div>

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
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {renderContent(post.content)}
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
