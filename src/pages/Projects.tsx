
import { Header } from "@/components/Header";
import { Projects } from "@/components/Projects";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              All Projects
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore my complete portfolio of projects, showcasing various technologies and innovative solutions.
            </p>
          </div>
          <Projects showAll={true} />
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;
