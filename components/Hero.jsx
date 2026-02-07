import React from 'react'

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 gradient-mesh relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-48 md:w-72 h-48 md:h-72 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 mb-4 md:mb-6 rounded-full glass-light text-xs md:text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs md:text-sm text-gray-300">Now with HD Video Calling</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            Watch Together.
          </span>
          <br />
          <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Feel Together.
          </span>
        </h1>
        
        <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
          Stream movies & series with friends in real-time. 
          Experience synchronized playback with crystal-clear video calls.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
          <a
            href="/sign-up"
            className="btn btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
          >
            Start Watching Free
            <span>→</span>
          </a>
          <a
            href="#features"
            className="btn btn-secondary text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
          >
            Learn More
          </a>
        </div>
        
        <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-gray-500 px-4">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>HD quality</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero