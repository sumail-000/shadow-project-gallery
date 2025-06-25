
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useProjects } from "@/hooks/useProjects";
import { ArrowLeft, Github, ExternalLink, Calendar, Users, Clock, Target, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center text-gray-400">Loading project details...</div>
          </div>
        </main>
      </div>
    );
  }

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
              <Button onClick={() => navigate('/projects')} className="bg-white text-black hover:bg-gray-200">
                <ArrowLeft className="mr-2" size={16} />
                Back to Projects
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Back Button */}
          <Button 
            onClick={() => navigate('/projects')} 
            variant="ghost" 
            className="mb-8 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Projects
          </Button>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  {project.project_category || 'Web Development'}
                </Badge>
                <Badge variant="outline" className="border-green-600 text-green-400">
                  {project.project_status || 'Completed'}
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">{project.title}</h1>
              
              <p className="text-xl text-gray-300 mb-8">
                {project.detailed_description || project.description}
              </p>

              {/* Project Meta */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span>{project.year}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={16} />
                  <span>{project.project_duration || '3-6 months'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={16} />
                  <span>{project.team_size || 3} team members</span>
                </div>
                {project.client_name && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Target size={16} />
                    <span>{project.client_name}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => window.open(project.live_url, '_blank')}
                  className="bg-white text-black hover:bg-gray-200 flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </Button>
                <Button
                  onClick={() => window.open(project.github_url, '_blank')}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
                >
                  <Github size={16} />
                  View Code
                </Button>
              </div>
            </div>

            <div>
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {project.demo_video_url && (
                <div className="mt-4">
                  <video
                    src={project.demo_video_url}
                    controls
                    className="w-full rounded-lg"
                    poster={project.image}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>

          {/* Technologies */}
          <Card className="bg-gray-900 border-gray-800 mb-12">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Goals */}
            {project.goals && project.goals.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <Target className="text-blue-400" size={20} />
                    Goals
                  </h3>
                  <ul className="space-y-2">
                    {project.goals.map((goal, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={16} />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Objectives */}
            {project.objectives && project.objectives.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <Target className="text-purple-400" size={20} />
                    Objectives
                  </h3>
                  <ul className="space-y-2">
                    {project.objectives.map((objective, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={16} />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={20} />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Challenges & Solutions */}
            {project.challenges && project.challenges.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <AlertCircle className="text-orange-400" size={20} />
                    Challenges & Solutions
                  </h3>
                  <div className="space-y-4">
                    {project.challenges.map((challenge, index) => (
                      <div key={index}>
                        <div className="text-gray-300 flex items-start gap-2 mb-2">
                          <AlertCircle className="text-orange-400 mt-1 flex-shrink-0" size={16} />
                          <span className="font-medium">Challenge:</span> {challenge}
                        </div>
                        {project.solutions && project.solutions[index] && (
                          <div className="text-gray-300 flex items-start gap-2 ml-6">
                            <Lightbulb className="text-yellow-400 mt-1 flex-shrink-0" size={16} />
                            <span className="font-medium">Solution:</span> {project.solutions[index]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Gallery */}
          {project.gallery_images && project.gallery_images.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-white">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.gallery_images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project.title} gallery ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => window.open(image, '_blank')}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
