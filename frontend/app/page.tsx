"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const logoSrc = '/logocom.jpg';

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] z-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Spotlight effect */}
      <div className="absolute top-0 w-full h-[500px] bg-purple-500/10 blur-[120px] rounded-[100%] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-6 text-center">
        
        {/* Logo Container */}
        <div 
          className={`mb-12 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          }`}
        >
          <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent ring-1 ring-white/10 shadow-2xl backdrop-blur-sm">
            <div className="bg-black/50 rounded-2xl p-6 overflow-hidden">
              <Image
                src={logoSrc}
                alt="KCET Logo"
                width={180}
                height={180}
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div 
          className={`space-y-6 transition-all duration-1000 delay-300 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 pb-2">
            Welcome to <br />
            Security Rounds <br />
            Management
          </h1>
          
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Turning routine security rounds into measurable,
            reliable, and proactive safety operations.
          </p>
        </div>

        {/* CTA Button */}
        <div 
          className={`mt-12 transition-all duration-1000 delay-500 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={() => router.push('/login')}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-black bg-white rounded-full overflow-hidden transition-transform active:scale-95"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative z-10 flex items-center gap-2 text-lg">
              LOGIN
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}