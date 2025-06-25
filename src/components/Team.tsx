
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Team = () => {
  const { teamMembers, loading } = useTeamMembers();

  if (loading) {
    return (
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Our Team
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Meet the talented individuals behind our success.
            </p>
          </div>
          <div className="text-center text-gray-400">Loading team members...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Our Team
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Meet the talented individuals behind our success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-black/30 p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-center mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-gray-400 mb-2">{member.role}</p>
                <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                {member.github && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => window.open(member.github, '_blank')}
                  >
                    <Github size={16} />
                  </Button>
                )}
                {member.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => window.open(member.linkedin, '_blank')}
                  >
                    <Linkedin size={16} />
                  </Button>
                )}
                {member.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => window.open(`mailto:${member.email}`, '_blank')}
                  >
                    <Mail size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
