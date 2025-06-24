
import { ProjectCard } from "./ProjectCard";

export const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      githubUrl: "#",
      liveUrl: "#",
      year: "2024"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
      technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
      githubUrl: "#",
      liveUrl: "#",
      year: "2023"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A responsive weather application that provides detailed weather information, forecasts, and location-based services using weather APIs.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "TypeScript", "Weather API"],
      githubUrl: "#",
      liveUrl: "#",
      year: "2023"
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website showcasing my projects and skills. Built with attention to performance and user experience.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      githubUrl: "#",
      liveUrl: "#",
      year: "2024"
    },
    {
      id: 5,
      title: "Chat Application",
      description: "Real-time chat application with private messaging, group chats, file sharing, and emoji support. Built for seamless communication.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80",
      technologies: ["Socket.io", "React", "Express", "PostgreSQL"],
      githubUrl: "#",
      liveUrl: "#",
      year: "2022"
    },
    {
      id: 6,
      title: "Data Visualization Tool",
      description: "Interactive dashboard for data visualization with charts, graphs, and real-time analytics. Designed for business intelligence needs.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      technologies: ["D3.js", "React", "Python", "Flask"],
      githubUrl: "#",
      liveUrl: "#",
      year: "2022"
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
