"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const rotateX = (clientY - centerY) * 0.02;
      const rotateY = (clientX - centerX) * -0.02;

      setMousePosition({ x: rotateX, y: rotateY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* 404 Number with 3D effect */}
        <div
          className="mb-8 transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`,
          }}
        >
          <div
            className={`text-9xl md:text-[180px] font-black bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent transition-all duration-1000 ${
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            404
          </div>
        </div>

        {/* Content */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page not found
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Oops! The page you&apos;re looking for has ventured into the digital
            void. Let&apos;s get you back on track.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold bg-primary text-primary-foreground transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Home className="w-5 h-5" />
              Back to Home
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold border-2 border-primary text-primary transition-all duration-300 hover:bg-primary/5"
            >
              <Search className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Decorative suggestion */}
          <div className="text-sm text-muted-foreground">
            <p>
              Did you mean:{" "}
              <Link
                href="/"
                className="text-primary hover:underline font-medium transition-colors"
              >
                Homepage
              </Link>
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/3 left-0 w-2 h-2 bg-primary rounded-full animate-bounce" />
        <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-100" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-200" />
      </div>
    </div>
  );
}
