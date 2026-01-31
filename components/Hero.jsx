import React from 'react'

const Hero = () => {
  return (
     <section className="h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        Watch Together. Feel Together.
      </h1>
      <p className="text-gray-300 max-w-xl mb-6">
        Stream movies & series with friends in real-time.
      </p>
      <a
        href="/sign-up"
        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-lg font-semibold"
      >
        Get Started
      </a>
    </section>
  )
}

export default Hero