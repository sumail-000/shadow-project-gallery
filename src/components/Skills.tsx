
import { useState, useEffect } from "react";
import { Code, Database, Wrench } from "lucide-react";
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
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
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
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Skills & Technologies
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Technologies and tools I've mastered throughout my development journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Code;
            
            return (
              <div 
                key={category} 
                className="group relative bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105 animate-fade-in-smooth"
                style={{
                  animationDelay: `${categoryIndex * 0.1}s`
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30">
                      <IconComponent className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-100 transition-colors duration-300">
                        {category}
                      </h3>
                      <div className="h-0.5 w-12 bg-gradient-to-r from-blue-400 to-purple-400 mt-1"></div>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <div 
                        key={skill.id} 
                        className="animate-fade-in-smooth"
                        style={{ animationDelay: `${(categoryIndex * 0.1) + (skillIndex * 0.05)}s` }}
                      >
                        {/* Skill Header */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-200 font-medium">
                            {skill.name}
                          </span>
                          <span className="text-blue-400 text-sm font-semibold">
                            {skill.level}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-800/60 rounded-full h-2">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
