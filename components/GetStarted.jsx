import React from 'react'

const GetStarted = () => {
  return (
    <section className="py-20 bg-linear-to-t from-black to-zinc-900 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to start watching together?
      </h2>
      <a
        href="/sign-up"
        className="inline-block mt-4 bg-red-600 hover:bg-red-700 px-8 py-3 rounded text-lg font-semibold"
      >
        Create Free Account
      </a>
    </section>
  )
}

export default GetStarted