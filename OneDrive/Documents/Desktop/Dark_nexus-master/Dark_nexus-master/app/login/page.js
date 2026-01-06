"use client";
import { React, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LoginWithBackground() {
  const loginBox = useRef(null);
  useGSAP(() => {
    gsap.from(loginBox.current, {
      autoAlpha: 0,
      x: "-120%",
      z: -100,
      duration: 1.5,
      ease: "power2.out",
    });
  });

  return (
    <div
      className="min-h-screen w-full flex items-center justify-start bg-cover bg-center px-4 scale-1.5"
      style={{ backgroundImage: "url('/pages/login-page.jpg')" }}
    >
      <div
        ref={loginBox}
        className="w-full max-w-md  bg-white/30 backdrop-blur rounded-xl p-6 md:mx-16 md:p-8  "
      >
        <h2 className="text-xl md:text-2xl font-semibold text-white text-center mb-6">
          Login
        </h2>

        <form className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-white">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-2 rounded border outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-2 rounded border outline-none"
            />
          </div>

          <button className="w-full p-2 bg-white rounded font-medium mt-2 text-black">
            Login
          </button>

          <div className="flex flex-row-reverse text-blue cursor-pointer">
            <h5 className="text-blue-500 underline"> Forget password</h5>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Responsive behaviour handled by tailwind classes */
