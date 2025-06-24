
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Calendar } from "lucide-react";
import { Project } from "@/hooks/useProjects";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 group">
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-black/70 px-2 py-1 rounded-full flex items-center gap-1">
          <Calendar size={12} />
          <span className="text-xs text-white">{project.year}</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => window.open(project.github_url, '_blank')}
          >
            <Github size={16} className="mr-2" />
            Code
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-white text-black hover:bg-gray-200"
            onClick={() => window.open(project.live_url, '_blank')}
          >
            <ExternalLink size={16} className="mr-2" />
            Live
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
