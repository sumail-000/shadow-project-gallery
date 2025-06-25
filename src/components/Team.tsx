
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Github, Linkedin, Mail } from "lucide-react";

export const Team = () => {
  const { teamMembers, loading } = useTeamMembers();

  if (loading) {
    return (
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The brilliant minds driving innovation and excellence in every project
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-400 text-lg">Loading team members...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Meet Our Team
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The brilliant minds driving innovation and excellence in every project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id} 
              className="group relative bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105 animate-fade-in-smooth"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                {/* Profile Image */}
                <div className="relative mb-6 mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-0.5 group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover bg-gray-800"
                    />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
                
                {/* Name and Role */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-blue-400 text-sm font-medium mb-4 uppercase tracking-wider">
                  {member.role}
                </p>
                
                {/* Bio */}
                <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed opacity-90">
                  {member.bio}
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {member.skills.slice(0, 4).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-gray-800/80 border border-gray-700/50 text-gray-300 text-xs rounded-full hover:bg-gray-700/80 hover:border-blue-500/30 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 4 && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-blue-300 text-xs rounded-full">
                      +{member.skills.length - 4} more
                    </span>
                  )}
                </div>
                
                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800/50 border border-gray-700/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/80 hover:border-blue-500/50 hover:scale-110 transition-all duration-300"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800/50 border border-gray-700/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/80 hover:border-blue-500/50 hover:scale-110 transition-all duration-300"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 bg-gray-800/50 border border-gray-700/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/80 hover:border-blue-500/50 hover:scale-110 transition-all duration-300"
                    >
                      <Mail size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
