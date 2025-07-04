
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeamMembers";

export const Team = () => {
  const { teamMembers, loading } = useTeamMembers();

  if (loading) {
    return (
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The talented individuals behind our successful projects and innovations.
            </p>
          </div>
          <div className="text-center text-gray-400">Loading team members...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The talented individuals behind our successful projects and innovations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-700 group-hover:border-gray-600 transition-colors duration-300"
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{member.bio}</p>
                
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-center space-x-3">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Mail size={18} />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
