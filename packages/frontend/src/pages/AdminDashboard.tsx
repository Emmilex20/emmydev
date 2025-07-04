// packages/frontend/src/pages/AdminDashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from '../components/AdminLogin';
import ProjectManagementForm from '../components/ProjectManagementForm';
import ProjectListForAdmin from '../components/ProjectListForAdmin';
import type { Project } from '../sections/Projects'; // Make sure this import path is correct for your Project type

const AdminDashboard: React.FC = () => {
  const { isAdminAuthenticated /*, logout */ } = useAuth(); // No longer need 'logout' here

  const [currentView, setCurrentView] = useState<'addProject' | 'manageProjects'>('manageProjects'); // Default to manage projects
  const [refreshProjects, setRefreshProjects] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null); // New state to hold the project being edited

  const handleProjectAddedOrUpdated = () => {
    console.log('Project added/updated successfully! Refreshing list.');
    setRefreshProjects(prev => !prev); // Trigger refresh
    setProjectToEdit(null); // Clear projectToEdit state
    setCurrentView('manageProjects'); // Go back to managing projects
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project); // Set the project to be edited
    setCurrentView('addProject'); // Switch to the add/edit form view
  };

  // Callback for when ProjectManagementForm is cancelled (e.g., from edit mode)
  const handleFormCancel = () => {
    setProjectToEdit(null); // Clear the project to edit
    setCurrentView('manageProjects'); // Return to the list view
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased">
      <header className="bg-gray-800 p-4 md:p-6 shadow-lg flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-400">Admin Panel</h1>
        {/*
          // REMOVED: Logout button is now handled by the Navbar
          {isAdminAuthenticated && (
            <button
              onClick={logout}
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          )}
        */}
      </header>

      <main className="p-4 sm:p-6 md:p-8 lg:p-12">
        {!isAdminAuthenticated ? (
          <AdminLogin />
        ) : (
          <div className="container-max-width mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 text-center text-light drop-shadow-md">
              Welcome, Admin!
            </h2>

            <nav className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 mb-8 flex-wrap">
              <button
                onClick={() => { setCurrentView('addProject'); setProjectToEdit(null); }} // Clear projectToEdit when switching to Add
                className={`py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg text-sm sm:text-base md:text-lg font-medium transition-all duration-300 ease-in-out whitespace-nowrap
                  ${currentView === 'addProject' ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50'}
                `}
              >
                Add New Project
              </button>
              <button
                onClick={() => setCurrentView('manageProjects')}
                className={`py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg text-sm sm:text-base md:text-lg font-medium transition-all duration-300 ease-in-out whitespace-nowrap
                  ${currentView === 'manageProjects' ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50'}
                `}
              >
                Manage Existing Projects
              </button>
            </nav>

            <div className="fade-in">
              {currentView === 'addProject' && (
                <ProjectManagementForm
                  onProjectAddedOrUpdated={handleProjectAddedOrUpdated}
                  initialProjectData={projectToEdit} // Pass the project to edit to the form
                  onCancel={handleFormCancel} // Pass the cancel handler
                />
              )}
              {currentView === 'manageProjects' && (
                <ProjectListForAdmin
                  refreshTrigger={refreshProjects}
                  onProjectDeleted={handleProjectAddedOrUpdated} // Re-use for deletion
                  onProjectEdit={handleEditProject} // Pass the new edit handler
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;