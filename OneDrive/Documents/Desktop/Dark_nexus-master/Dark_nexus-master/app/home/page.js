"use client";
import React, { useEffect, useRef } from "react";

const StellarXPresentation = () => {
  const heroRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  useEffect(() => {
    // Load GSAP from CDN
    const script1 = document.createElement("script");
    script1.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
    script2.async = true;

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    script2.onload = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Parallax stars on scroll
      gsap.to(".stars-layer-1", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        y: 200,
        ease: "none",
      });

      gsap.to(".stars-layer-2", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        y: 400,
        ease: "none",
      });

      gsap.to(".stars-layer-3", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        y: 600,
        ease: "none",
      });

      // Animate individual stars opacity on scroll
      document.querySelectorAll(".star-animate").forEach((star) => {
        const randomDuration = Math.random() * 3 + 2;

        gsap.to(star, {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: randomDuration,
          },
          opacity: () => Math.random() * 0.5 + 0.5,
          scale: () => Math.random() * 0.5 + 1,
          ease: "none",
        });
      });

      // Rotate milky way on scroll
      gsap.to(".milky-way", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        rotation: 20,
        scale: 1.2,
        opacity: 0.8,
        ease: "none",
      });

      // Hero section animations
      gsap.from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".hero-circle", {
        scale: 0,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "back.out(1.7)",
      });

      gsap.from(".hero-bar", {
        scaleX: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
      });

      gsap.from(".hero-buttons", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.8,
        ease: "power3.out",
      });

      // Section 1 animation
      gsap.from(".section1-circle", {
        scrollTrigger: {
          trigger: section1Ref.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
        scale: 0,
        rotation: -180,
        opacity: 0,
      });

      gsap.from(".section1-text", {
        scrollTrigger: {
          trigger: section1Ref.current,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
        x: 100,
        opacity: 0,
      });

      // Section 2 animation
      gsap.from(".section2-circle", {
        scrollTrigger: {
          trigger: section2Ref.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
        scale: 0,
        rotation: 180,
        opacity: 0,
      });

      gsap.from(".section2-image", {
        scrollTrigger: {
          trigger: section2Ref.current,
          start: "top 75%",
          end: "top 35%",
          scrub: 1,
        },
        scale: 0.5,
        opacity: 0,
      });

      gsap.from(".section2-text", {
        scrollTrigger: {
          trigger: section2Ref.current,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
        x: 100,
        opacity: 0,
      });

      // Section 3 - Horizontal scroll text animation
      gsap.fromTo(
        ".section3-text",
        {
          x: "-100%",
        },
        {
          scrollTrigger: {
            trigger: section3Ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          x: "100%",
          ease: "none",
        }
      );

      gsap.from(".section3-bg-circle", {
        scrollTrigger: {
          trigger: section3Ref.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
        scale: 0,
        rotation: -90,
        opacity: 0,
      });
    };

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleSignup = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="bg-gray-900 text-white overflow-x-hidden relative">
      {/* Starry Night Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Galaxy gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30"></div>

        {/* Stars layer 1 - small stars with parallax */}
        <div className="stars-layer-1 absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={`star1-${i}`}
              className="star-animate absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Stars layer 2 - medium stars with parallax */}
        <div className="stars-layer-2 absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={`star2-${i}`}
              className="star-animate absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Stars layer 3 - bright stars with parallax */}
        <div className="stars-layer-3 absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={`star3-${i}`}
              className="star-animate absolute w-2 h-2 bg-white rounded-full animate-pulse-star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.9 + 0.1,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 4 + 3}s`,
                boxShadow: "0 0 4px rgba(255, 255, 255, 0.8)",
              }}
            ></div>
          ))}
        </div>

        {/* Milky Way effect with scroll animation */}
        <div className="milky-way absolute top-1/4 left-0 w-full h-1/2 bg-linear-to-r from-transparent via-purple-500/10 to-transparent rotate-[-30deg] blur-3xl"></div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes pulse-star {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-pulse-star {
          animation: pulse-star 4s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 md:px-12 lg:px-20"
      >
        <div className="hero-circle absolute w-75 h-75 md:w-112.5 md:h-112.5 lg:w-137.5 lg:h-137.5 bg-purple-600 rounded-full right-0 md:right-20 lg:right-32 top-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 w-full md:w-auto">
          <h1 className="hero-title text-5xl md:text-7xl lg:text-9xl font-bold tracking-wider">
            STELL<span className="text-purple-400">ARX</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl mt-4 text-gray-400">
            While students look, we track the strings.
          </p>
          <div className="flex gap-4 mt-6 md:mt-8">
            <div className="hero-bar w-12 md:w-16 h-2 bg-purple-400 rounded-full"></div>
            <div className="hero-bar w-12 md:w-16 h-2 bg-purple-600 rounded-full"></div>
          </div>
          <div className="hero-buttons flex gap-4 mt-8 md:mt-10">
            <button
              onClick={handleLogin}
              className="px-6 md:px-8 py-2 md:py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="px-6 md:px-8 py-2 md:py-3 bg-transparent border-2 border-purple-400 hover:bg-purple-400/20 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Section 1 - Frame 16 */}
      <section
        ref={section1Ref}
        className="min-h-screen flex items-center justify-center relative px-4 md:px-12 lg:px-20 py-12 md:py-0"
      >
        <div className="section1-circle absolute w-70 h-70 md:w-100 md:h-100 lg:w-125 lg:h-125 bg-purple-600 rounded-full left-4 md:left-12 lg:left-20"></div>
        <div className="section1-text relative z-10 max-w-md ml-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Empowering Smarter Coding Classrooms
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
            Teaching coding to a large group of students is challenging. Each
            student may work at different paces, struggle with unique concepts,
            or become easily disengaged without real-time feedback.
          </p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Educators need tools that actively monitor individual progress and
            provide timely insights to keep students motivated and focused.
          </p>
        </div>
      </section>

      {/* Section 2 - Frame 17 */}
      <section
        ref={section2Ref}
        className="min-h-screen flex items-center justify-center relative px-4 md:px-12 lg:px-20 py-12 md:py-0"
      >
        <div className="section2-circle absolute w-70 h-70 md:w-100 md:h-100 lg:w-125 lg:h-125 bg-purple-600 rounded-full left-4 md:left-12 lg:left-20 flex items-center justify-center">
          <div className="section2-image">
            <div className="w-40 h-28 md:w-52 md:h-36 lg:w-64 lg:h-40 bg-gray-800 rounded-lg p-2 md:p-3 lg:p-4 shadow-2xl">
              <div className="grid grid-cols-4 gap-1 md:gap-1.5 lg:gap-2 h-full">
                <div className="bg-pink-500 rounded"></div>
                <div className="bg-purple-500 rounded"></div>
                <div className="bg-blue-500 rounded"></div>
                <div className="bg-pink-400 rounded"></div>
                <div className="bg-purple-400 rounded"></div>
                <div className="bg-blue-400 rounded"></div>
                <div className="bg-pink-600 rounded"></div>
                <div className="bg-purple-600 rounded"></div>
                <div className="bg-blue-600 rounded"></div>
                <div className="bg-pink-500 rounded"></div>
                <div className="bg-purple-500 rounded"></div>
                <div className="bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="section2-text relative z-10 max-w-md ml-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Empowering Smarter Coding Classrooms
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
            Teaching coding to a large group of students is challenging. Each
            student may work at different paces, struggle with unique concepts,
            or become easily disengaged without real-time feedback.
          </p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Educators need tools that actively monitor individual progress and
            provide timely insights to keep students motivated, or progress as
            they build apps.
          </p>
        </div>
      </section>

      {/* Section 3 - Horizontal Scroll Text */}
      <section
        ref={section3Ref}
        className="min-h-screen flex items-center justify-center relative px-4 md:px-12 lg:px-20 py-12 md:py-0"
      >
        <div className="section3-bg-circle absolute w-75 h-75 md:w-112.5 md:h-112.5 lg:w-137.5 lg:h-137.5 bg-purple-600/40 rounded-full right-10 md:right-20 lg:right-32"></div>
        <div className="relative z-10 w-full overflow-hidden">
          <div className="section3-text text-3xl md:text-5xl lg:text-7xl font-bold whitespace-nowrap will-change-transform">
            Real-Time Insights • Student Progress • Coding Excellence • Track
            Performance
          </div>
        </div>
      </section>
    </div>
  );
};

export default StellarXPresentation;
