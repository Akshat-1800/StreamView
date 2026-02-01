import React from 'react'

const About = () => {
  const features = [
    {
      icon: '🎬',
      title: 'Synchronized Playback',
      description: 'Watch in perfect sync with friends. Play, pause, and seek together.'
    },
    {
      icon: '📹',
      title: 'HD Video Calls',
      description: 'See your friends\' reactions in real-time with crystal clear video.'
    },
    {
      icon: '🎉',
      title: 'Watch Parties',
      description: 'Create private rooms and invite anyone to join your viewing session.'
    },
    {
      icon: '⭐',
      title: 'Premium Content',
      description: 'Access exclusive movies and series with our premium subscription.'
    }
  ]

  return (
    <section id="features" className="py-24 px-6 gradient-mesh">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-title text-4xl mb-4">Why Choose StreamView?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            The ultimate platform for shared viewing experiences with friends and family.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card p-6 text-center hover:border-red-500/30 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About