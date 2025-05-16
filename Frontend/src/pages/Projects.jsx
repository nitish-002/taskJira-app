import ProjectList from '../components/projects/ProjectList';
import Sidebar from '../components/layout/Sidebar';

function Projects() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50">
      <Sidebar />
      <div className="md:ml-64">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6 mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-600 mb-4">
              Projects
            </h1>
            <p className="text-slate-600">
              Manage and organize all your projects in one place
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-6">
            <ProjectList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
