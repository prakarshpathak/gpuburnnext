"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 border-b border-border pb-4 md:pb-6">
      <div className="flex items-center gap-3 md:gap-4">
        <Image
          src="/gpu-logo-final.png"
          alt="cheapestGPU Logo"
          width={64}
          height={64}
          className="h-12 md:h-16 w-auto object-contain cursor-pointer"
          onClick={() => router.push('/')}
          priority
        />
        <div>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent font-pixelify cursor-pointer"
            onClick={() => router.push('/')}
          >
            cheapestGPU
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground mt-1 md:mt-2">
            The Internet&apos;s Cheapest GPU Marketplace
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className={`text-base md:text-lg font-medium transition-colors hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className={`text-base md:text-lg font-medium transition-colors hover:text-primary ${pathname?.startsWith('/blog') ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            Blog
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
