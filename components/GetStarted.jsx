import React from 'react'

const GetStarted = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Ready to start watching together?
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of users enjoying movies and series with their friends and family.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/sign-up"
            className="btn btn-primary text-lg px-10 py-4 animate-pulse-glow"
          >
            Create Free Account
          </a>
          <a
            href="/sign-in"
            className="btn btn-ghost text-lg px-10 py-4 border border-gray-700"
          >
            Sign In
          </a>
        </div>
      </div>
    </section>
  )
}

export default GetStarted