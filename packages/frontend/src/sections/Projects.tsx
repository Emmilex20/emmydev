// packages/frontend/src/sections/Projects.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SectionContainer from '../components/SectionContainer';
import SectionHeader from '../components/SectionHeader';
import api from '../services/api';

// --- NEW: Define interfaces to match your backend Project model ---
export interface IImageInfo {
  url: string;
  public_id: string;
}

export interface Project { // Updated to match backend
  _id: string; // Backend uses _id
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string; // Optional
  liveLink?: string; // Optional
  thumbnail: IImageInfo; // Matches backend: object with url and public_id
  images?: IImageInfo[];     // Matches backend: array of objects (optional)
  category: 'web' | 'mobile' | 'ui-ux' | 'game' | 'other'; // Enforce specific categories
  order: number;
  createdAt: string; // Assuming date strings from backend
  updatedAt: string; // Assuming date strings from backend
}
// --- END NEW INTERFACES ---

// Re-using your existing categories, as these are typically fixed for filtering
const projectCategories = ['All', 'web', 'mobile', 'ui-ux', 'game', 'other'];

// --- Animation Variants ---
const projectCardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom ease-out for a bit more pop
    }
  },
  exit: {
    y: -50,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn" as const
    }
  },
};

const filterButtonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const
    }
  },
};

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]); // State to hold fetched projects
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // For modal image carousel

  // Effect to manage body scroll when modal is open/closed
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  // useEffect to fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using `api.get` from your provided service
        const response = await api.get('/api/projects');
        // Assuming your backend returns an array of project objects
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array means this runs once on component mount

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0); // Reset carousel to first image when opening new modal
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const nextImage = () => {
    // Safely check if selectedProject and selectedProject.images exist before proceeding
    if (selectedProject && selectedProject.images && selectedProject.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % selectedProject.images!.length // Use ! operator here since we've checked above
      );
    }
  };

  const prevImage = () => {
    // Safely check if selectedProject and selectedProject.images exist before proceeding
    if (selectedProject && selectedProject.images && selectedProject.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex - 1 + selectedProject.images!.length) % selectedProject.images!.length // Use ! operator here
      );
    }
  };


  // --- Loading State Render ---
  if (loading) {
    return (
      <SectionContainer id="projects" className="bg-gradient-to-b from-gray-950 to-gray-800 text-light py-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-xl text-primary-400">Loading projects...</p>
        </div>
      </SectionContainer>
    );
  }

  // --- Error State Render ---
  if (error) {
    return (
      <SectionContainer id="projects" className="bg-gradient-to-b from-gray-950 to-gray-800 text-light py-20 min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-900 bg-opacity-30 rounded-lg border border-red-700">
          <p className="text-xl text-red-400 font-semibold mb-2">Error!</p>
          <p className="text-lg text-red-300">{error}</p>
          <p className="text-sm text-red-200 mt-4">Please check your network connection or try refreshing the page.</p>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="projects" className="bg-gradient-to-b from-gray-950 to-gray-800 text-light py-20 overflow-hidden">
      <SectionHeader
        title="My Work"
        subtitle="Explore a selection of my recent projects, showcasing my diverse skills and problem-solving approach."
      />

      {/* Filter Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mt-12 mb-16 px-4 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {projectCategories.map(category => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-300
                        ${selectedCategory === category
                            ? 'bg-primary-600 text-white shadow-lg ring-2 ring-primary-400'
                            : 'bg-gray-700 text-gray-300 hover:bg-primary-500 hover:text-white'
                        }`}
            variants={filterButtonVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category === 'web' ? 'Web Development' :
             category === 'mobile' ? 'Mobile Apps' :
             category === 'ui-ux' ? 'UI-UX' :
             category === 'desktop' ? 'Desktop Apps' :
             category === 'game' ? 'Games' :
             category === 'other' ? 'Other' : 'All Projects'}
          </motion.button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto px-4"
      >
        <AnimatePresence mode='wait'>
          {filteredProjects.length === 0 && !loading && !error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center text-gray-400 text-lg py-10"
            >
              No projects found for this category.
            </motion.p>
          ) : (
            filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700
                           hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer
                           relative group"
                variants={projectCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.03, boxShadow: '0px 10px 30px rgba(0,0,0,0.5), 0px 0px 20px rgba(74, 222, 128, 0.7)' }}
                onClick={() => openModal(project)}
              >
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider z-20">
                  {project.category}
                </span>

                <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                  {project.thumbnail && project.thumbnail.url ? (
                    <img
                      src={project.thumbnail.url}
                      alt={project.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400 text-lg">
                      No Image Available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-heading font-bold text-primary-400 mb-3 truncate">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-base mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-4">
                    {project.githubLink && (
                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
                        title="GitHub Repository"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaGithub />
                      </motion.a>
                    )}
                    {project.liveLink && (
                      <motion.a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
                        title="Live Demo"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaExternalLinkAlt />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-dark bg-opacity-90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-primary-500 relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-4xl focus:outline-none transition-colors duration-200"
                title="Close"
              >
                &times;
              </button>

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-400 mb-4 pb-2 border-b border-gray-700">
                {selectedProject.title}
              </h2>

              {/* Image Carousel / Single Image Display */}
              <div className="relative mb-6">
                {/* Safely access selectedProject.images */}
                {selectedProject.images && selectedProject.images.length > 1 ? (
                  // Carousel for multiple images
                  <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-lg bg-gray-700 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selectedProject.images[currentImageIndex].url} // Use image URL as key
                        src={selectedProject.images[currentImageIndex].url}
                        alt={`${selectedProject.title} image ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </AnimatePresence>
                    {/* Navigation Buttons */}
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-dark bg-opacity-70 text-white p-2 rounded-full text-2xl hover:bg-primary-500 transition-colors z-30"
                      title="Previous Image"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-dark bg-opacity-70 text-white p-2 rounded-full text-2xl hover:bg-primary-500 transition-colors z-30"
                      title="Next Image"
                    >
                      <FaChevronRight />
                    </button>
                    {/* Image Counter */}
                    <span className="absolute bottom-3 right-3 bg-dark bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {selectedProject.images.length}
                    </span>
                  </div>
                ) : selectedProject.thumbnail && selectedProject.thumbnail.url ? (
                  // Single thumbnail if no 'images' array or only one image
                  <img
                    src={selectedProject.thumbnail.url}
                    alt={selectedProject.title}
                    className="w-full h-auto max-h-96 object-contain rounded-lg bg-gray-700"
                  />
                ) : (
                  // Fallback if no images are available
                  <div className="w-full h-72 flex items-center justify-center bg-gray-700 text-gray-400 text-lg rounded-lg">
                    No Images Available for Details
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-lg mb-6">{selectedProject.description}</p>

              <div className="mb-6">
                <h4 className="text-xl font-semibold text-primary-300 mb-3 border-b border-gray-700 pb-2">Technologies Used:</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-primary-700 text-white text-base px-4 py-1.5 rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-start sm:justify-center items-center gap-6 mt-8 pt-6 border-t border-gray-700">
                {selectedProject.githubLink && (
                  <motion.a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-gray-700 text-gray-200 px-6 py-3 rounded-full text-xl font-semibold
                               hover:bg-primary-500 hover:text-dark transition-all duration-300 shadow-md"
                    title="View on GitHub"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaGithub className="mr-3 text-2xl" /> View Code
                  </motion.a>
                )}
                {selectedProject.liveLink && (
                  <motion.a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-primary-600 text-white px-6 py-3 rounded-full text-xl font-semibold
                               hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-md"
                    title="See Live Demo"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaExternalLinkAlt className="mr-3 text-xl" /> Live Demo
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionContainer>
  );
};

export default Projects;