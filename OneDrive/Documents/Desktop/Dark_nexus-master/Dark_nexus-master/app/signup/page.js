"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SignupWithBackground() {
  const signupBox = useRef(null);

  useGSAP(() => {
    gsap.from(signupBox.current, {
      autoAlpha: 0,
      x: "120%",
      z: -100,
      duration: 1.5,
      ease: "power2.out",
    });
  });

  return (
    <div
      className="min-h-screen w-full flex  flex-row-reverse items-center justify-start bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/pages/signup-page.png')" }}
    >
      <div
        ref={signupBox}
        className="w-full max-w-md bg-white/30 backdrop-blur rounded-xl p-6 md:mx-16 md:p-8"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-white text-center mb-6">
          Signup
        </h2>

        <form className="space-y-4">
          {/* ---------- Full Name ---------- */}
          <div className="space-y-1">
            <label className="text-sm text-white">Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter full name"
              className="w-full p-2 rounded border outline-none"
            />
          </div>

          {/* ---------- Email ---------- */}
          <div className="space-y-1">
            <label className="text-sm text-white">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              className="w-full p-2 rounded border outline-none"
            />
          </div>

          {/* ---------- Password ---------- */}
          <div className="space-y-1">
            <label className="text-sm text-white">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              className="w-full p-2 rounded border outline-none"
            />
          </div>

          <button className="w-full p-2 bg-white rounded font-medium mt-2 text-black">
            Create Account
          </button>

          <div className=" flex flex-row-reverse text-xs text-white/80">
            <h5 className="text-blue-500 font-light text-xl cursor-pointer">
              Login
            </h5>
          </div>
        </form>
      </div>
    </div>
  );
}
