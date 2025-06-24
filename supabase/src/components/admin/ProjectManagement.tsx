
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useProjects, Project } from "@/hooks/useProjects";
import { Edit, Plus, ExternalLink, Github, Trash2 } from "lucide-react";

export const ProjectManagement = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    github_url: '',
    live_url: '',
    year: new Date().getFullYear().toString()
  });

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies.join(', '),
      github_url: project.github_url,
      live_url: project.live_url,
      year: project.year
    });
    setIsEditing(true);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setProjectForm({
      title: '',
      description: '',
      image: '',
      technologies: '',
      github_url: '',
      live_url: '',
      year: new Date().getFullYear().toString()
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const technologiesArray = projectForm.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    
    let result;
    if (isEditing && selectedProject) {
      result = await updateProject(selectedProject.id, {
        ...projectForm,
        technologies: technologiesArray
      });
    } else {
      result = await addProject({
        ...projectForm,
        technologies: technologiesArray
      });
    }

    if (result.success) {
      handleNewProject();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const result = await deleteProject(id);
      if (result.success && selectedProject?.id === id) {
        handleNewProject();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Form Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            {isEditing ? <Edit size={20} /> : <Plus size={20} />}
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </CardTitle>
          {isEditing && (
            <Button 
              onClick={handleNewProject} 
              variant="outline" 
              size="sm" 
              className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500"
            >
              Add New
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-200">Project Title</Label>
                <Input
                  id="title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="year" className="text-gray-200">Year</Label>
                <Input
                  id="year"
                  value={projectForm.year}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="2024"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-200">Description</Label>
              <textarea
                id="description"
                value={projectForm.description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter project description"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="image" className="text-gray-200">Image URL</Label>
              <Input
                id="image"
                value={projectForm.image}
                onChange={(e) => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="technologies" className="text-gray-200">Technologies (comma separated)</Label>
              <Input
                id="technologies"
                value={projectForm.technologies}
                onChange={(e) => setProjectForm(prev => ({ ...prev, technologies: e.target.value }))}
                placeholder="React, Node.js, MongoDB"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github" className="text-gray-200">GitHub URL</Label>
                <Input
                  id="github"
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, github_url: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="live" className="text-gray-200">Live URL</Label>
                <Input
                  id="live"
                  value={projectForm.live_url}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, live_url: e.target.value }))}
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
            >
              {isEditing ? 'Update Project' : 'Add Project'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Projects Preview ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-6 space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProject?.id === project.id
                      ? 'border-white bg-gray-800'
                      : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                  }`}
                  onClick={() => handleProjectSelect(project)}
                >
                  <div className="flex gap-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{project.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">{project.year}</span>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project.id);
                            }}
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 border-red-600 bg-red-900/20 text-red-400 hover:text-red-300 hover:bg-red-900/40"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-6 px-2 border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                        >
                          <Github size={12} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-6 px-2 border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
