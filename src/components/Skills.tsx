import { useState, useEffect } from "react";
import { Code, Database, Wrench, TrendingUp, Zap, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
}

const categoryIcons = {
  "Frontend": Code,
  "Backend": Database,
  "Tools & Others": Wrench,
};

export const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fallback data if database is empty
  const fallbackSkills = [
    { id: "1", name: "React", level: 90, category: "Frontend" },
    { id: "2", name: "TypeScript", level: 85, category: "Frontend" },
    { id: "3", name: "Vue.js", level: 80, category: "Frontend" },
    { id: "4", name: "Tailwind CSS", level: 90, category: "Frontend" },
    { id: "5", name: "Next.js", level: 75, category: "Frontend" },
    { id: "6", name: "Node.js", level: 85, category: "Backend" },
    { id: "7", name: "Python", level: 80, category: "Backend" },
    { id: "8", name: "Express.js", level: 85, category: "Backend" },
    { id: "9", name: "PostgreSQL", level: 75, category: "Backend" },
    { id: "10", name: "MongoDB", level: 80, category: "Backend" },
    { id: "11", name: "Git", level: 90, category: "Tools & Others" },
    { id: "12", name: "Docker", level: 70, category: "Tools & Others" },
    { id: "13", name: "AWS", level: 65, category: "Tools & Others" },
    { id: "14", name: "Figma", level: 75, category: "Tools & Others" },
    { id: "15", name: "Jest", level: 80, category: "Tools & Others" },
  ];

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('level', { ascending: false });

      if (error) {
        console.log("Error fetching skills, using fallback data:", error);
        setSkills(fallbackSkills);
      } else if (data && data.length > 0) {
        setSkills(data);
      } else {
        setSkills(fallbackSkills);
      }
    } catch (error) {
      console.log("Using fallback skills data");
      setSkills(fallbackSkills);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded-lg w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-700 rounded-lg w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none animate-pulse"></div>
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.03)_60deg,transparent_120deg)] animate-spin-slow pointer-events-none"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-full px-8 py-3 mb-8 shadow-2xl">
            <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-400 text-sm font-semibold tracking-wide">TECHNICAL MASTERY</span>
            <Star className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent animate-glow">
            Skills & Technologies
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Cutting-edge technologies and frameworks mastered through years of dedicated development
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Code;
            
            return (
              <div 
                key={category} 
                className="group relative animate-fade-in-smooth"
                style={{ animationDelay: `${categoryIndex * 0.3}s` }}
              >
                {/* Enhanced Card Background with Multiple Layers */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse opacity-50 group-hover:opacity-75"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-cyan-400/30 rounded-3xl blur-sm group-hover:blur-md transition-all duration-500"></div>
                
                <div className="relative bg-black/60 backdrop-blur-xl border border-gray-700/30 group-hover:border-blue-400/30 rounded-3xl p-10 h-full transition-all duration-700 group-hover:transform group-hover:scale-[1.03] group-hover:shadow-2xl shadow-blue-500/10">
                  
                  {/* Animated Corner Accents */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400/50 group-hover:border-blue-300 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple-400/50 group-hover:border-purple-300 transition-colors duration-500"></div>
                  
                  {/* Category Header with Enhanced Styling */}
                  <div className="flex items-center gap-5 mb-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-2xl blur-md animate-pulse"></div>
                      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-cyan-500/30 border border-blue-400/40 group-hover:from-blue-400/40 group-hover:to-cyan-400/40 transition-all duration-500 shadow-xl">
                        <IconComponent className="w-8 h-8 text-white drop-shadow-lg animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white group-hover:text-blue-100 transition-colors duration-500 tracking-wide">
                        {category}
                      </h3>
                      <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 to-purple-400 mt-2 group-hover:w-24 transition-all duration-500"></div>
                    </div>
                  </div>

                  {/* Enhanced Skills List */}
                  <div className="space-y-8">
                    {categorySkills.map((skill, skillIndex) => (
                      <div 
                        key={skill.id} 
                        className="group/skill relative animate-fade-in-smooth"
                        style={{ animationDelay: `${(categoryIndex * 0.3) + (skillIndex * 0.1)}s` }}
                      >
                        {/* Skill Header with Enhanced Design */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-200 font-semibold text-lg group-hover/skill:text-white transition-colors duration-300 tracking-wide">
                            {skill.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 border border-blue-400/40 backdrop-blur-sm shadow-lg">
                              <span className="text-blue-200 font-bold text-sm tracking-wider">{skill.level}%</span>
                            </div>
                            {skill.level >= 85 && (
                              <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                            )}
                          </div>
                        </div>

                        {/* Advanced Progress Bar Design */}
                        <div className="relative overflow-hidden">
                          <div className="w-full bg-gray-800/60 rounded-full h-4 backdrop-blur-sm border border-gray-700/50 shadow-inner">
                            {/* Multiple Progress Layers for Depth */}
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 rounded-full relative overflow-hidden shadow-lg transition-all duration-1200 ease-out group-hover/skill:from-blue-500 group-hover/skill:via-purple-500 group-hover/skill:to-cyan-500"
                              style={{ 
                                width: `${skill.level}%`,
                                animation: `skill-fill-${skillIndex} 2s ease-out 0.5s forwards`
                              }}
                            >
                              {/* Animated Shimmer Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                              {/* Pulsing Highlight */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          
                          {/* Enhanced Glow Effect */}
                          <div 
                            className="absolute -top-1 -bottom-1 left-0 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-cyan-500/40 rounded-full blur-lg opacity-0 group-hover/skill:opacity-100 transition-opacity duration-500"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>

                        {/* Skill Level Indicator */}
                        <div className="mt-2 flex justify-end">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  i < Math.floor(skill.level / 20)
                                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-sm'
                                    : 'bg-gray-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Bottom Decoration */}
        <div className="mt-20 flex justify-center">
          <div className="relative">
            <div className="w-48 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute -top-1 -bottom-1 left-4 right-4 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-cyan-500/40 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
