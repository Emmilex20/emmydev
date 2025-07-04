/* eslint-disable @typescript-eslint/no-explicit-any */
// packages/frontend/src/components/ProjectListForAdmin.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Your API service
import type { Project } from '../sections/Projects'; // Assuming Project type is defined here
import { FaEdit, FaTrash, FaSpinner } from 'react-icons/fa'; // Icons for actions

interface ProjectListForAdminProps {
  refreshTrigger: boolean; // Prop to trigger a re-fetch of projects
  onProjectDeleted: () => void; // Callback after a project is deleted
  onProjectEdit: (project: Project) => void; // NEW: Callback when edit is clicked
}

const ProjectListForAdmin: React.FC<ProjectListForAdminProps> = ({ refreshTrigger, onProjectDeleted, onProjectEdit }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/projects'); // Adjust endpoint if needed
      setProjects(response.data);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.message || 'Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await api.delete(`/api/projects/${id}`); // Adjust endpoint if needed
        onProjectDeleted(); // Notify parent to refresh list
      } catch (err: any) {
        console.error('Error deleting project:', err);
        setError(err.response?.data?.message || 'Failed to delete project.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]); // Re-fetch projects whenever refreshTrigger changes

  if (loading) {
    return (
      <div className="text-center py-8 text-primary-400">
        <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button onClick={fetchProjects} className="mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md">
          Retry
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-xl">No projects found. Time to add some!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h3 className="text-2xl font-bold text-primary-400 mb-6 text-center">Manage Projects</h3>
      <div className="overflow-x-auto"> {/* Makes table scrollable on small screens */}
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">Technologies</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {projects.map((project) => (
              <tr key={project._id} className="hover:bg-gray-700 transition-colors duration-200">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{project.title}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{project.category}</td>
                <td className="px-4 py-3 text-sm text-gray-300 hidden md:table-cell">
                  {project.technologies.join(', ')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{project.order}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onProjectEdit(project)} // Call onProjectEdit with the project data
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-gray-600"
                      title="Edit Project"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-gray-600"
                      title="Delete Project"
                      disabled={deletingId === project._id}
                    >
                      {deletingId === project._id ? <FaSpinner className="animate-spin" /> : <FaTrash className="text-lg" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectListForAdmin;