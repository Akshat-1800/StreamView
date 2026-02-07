import React from 'react'

const Footer = () => {
  return (
    <footer className="py-6 md:py-8 px-4 md:px-6 bg-black border-t border-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              StreamView
            </span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="text-xs md:text-sm text-gray-500">Watch Together, Feel Together</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="mailto:contact@streamview.com" className="hover:text-white transition-colors">Contact</a>
          </div>
          
          <div className="text-xs md:text-sm text-gray-600">
            © 2026 StreamView. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer