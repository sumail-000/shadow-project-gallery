
import { ProjectCard } from "./ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProjectsProps {
  showAll?: boolean;
}

export const Projects = ({ showAll = false }: ProjectsProps) => {
  const { projects, loading } = useProjects();
  const navigate = useNavigate();

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A collection of projects I've worked on over the years, showcasing my growth and expertise in various technologies.
            </p>
          </div>
          <div className="text-center text-gray-400">Loading projects...</div>
        </div>
      </section>
    );
  }

  const displayedProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {!showAll && (
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A collection of projects I've worked on over the years, showcasing my growth and expertise in various technologies.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {!showAll && projects.length > 6 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/projects')}
              className="bg-white text-black text-lg px-8 py-3 hover:bg-gray-200 transition-colors duration-300"
              size="lg"
            >
              Explore All Projects
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
