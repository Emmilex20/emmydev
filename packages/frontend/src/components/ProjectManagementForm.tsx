/* eslint-disable @typescript-eslint/no-explicit-any */
// packages/frontend/src/components/ProjectManagementForm.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Project } from '../sections/Projects'; // Your Project type
import { FaSpinner, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

// Assuming IImageInfo type is defined if you have it for Cloudinary responses
// IMPORTANT: This should match your backend IImageInfo interface exactly
interface IImageInfo {
  url: string;
  public_id: string;
}

interface ProjectManagementFormProps {
  onProjectAddedOrUpdated: () => void;
  initialProjectData?: Project | null; // Optional prop to pass project data for editing
  onCancel?: () => void; // New optional prop for a cancel button
}

const ProjectManagementForm: React.FC<ProjectManagementFormProps> = ({ onProjectAddedOrUpdated, initialProjectData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '', // Comma-separated string for input
    githubLink: '',
    liveLink: '',
    category: '',
    order: '',
    thumbnailFile: null as File | null,
    // Note: imageFiles is replaced by newImageFiles for clarity for updates
    newImageFiles: [] as File[],
    existingThumbnail: null as IImageInfo | null, // To display existing thumbnail
    existingImages: [] as IImageInfo[], // To display existing additional images
    imagesToDelete: [] as string[], // Store public_ids of images to delete
    clearExistingImages: false, // Flag to clear all existing images
    clearThumbnail: false, // Flag to clear existing thumbnail (added)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Effect to populate form data when initialProjectData changes (for editing)
  useEffect(() => {
    if (initialProjectData) {
      setFormData({
        title: initialProjectData.title || '',
        description: initialProjectData.description || '',
        technologies: initialProjectData.technologies.join(', ') || '',
        githubLink: initialProjectData.githubLink || '',
        liveLink: initialProjectData.liveLink || '',
        category: initialProjectData.category || '',
        order: initialProjectData.order ? String(initialProjectData.order) : '',
        thumbnailFile: null, // No new file selected initially
        newImageFiles: [], // No new files selected initially for adding
        existingThumbnail: initialProjectData.thumbnail || null,
        existingImages: initialProjectData.images || [],
        imagesToDelete: [],
        clearExistingImages: false,
        clearThumbnail: false, // Reset this flag
      });
      setSuccess(null); // Clear success message when switching to edit
    } else {
      // Clear form when switching from edit to add mode
      setFormData({
        title: '',
        description: '',
        technologies: '',
        githubLink: '',
        liveLink: '',
        category: '',
        order: '',
        thumbnailFile: null,
        newImageFiles: [],
        existingThumbnail: null,
        existingImages: [],
        imagesToDelete: [],
        clearExistingImages: false,
        clearThumbnail: false,
      });
      setError(null);
      setSuccess(null);
    }
  }, [initialProjectData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log("1. THUMBNAIL CHANGE: File selected:", selectedFile);
      console.log("1. THUMBNAIL CHANGE: File name:", selectedFile.name);
      console.log("1. THUMBNAIL CHANGE: File type:", selectedFile.type);
      console.log("1. THUMBNAIL CHANGE: File size:", selectedFile.size);

      setFormData(prev => ({
        ...prev,
        thumbnailFile: selectedFile,
        existingThumbnail: null,
        clearThumbnail: false,
      }));
      console.log("1. THUMBNAIL CHANGE: State updated with thumbnailFile.");
    } else {
      console.log("1. THUMBNAIL CHANGE: No thumbnail file selected or input cleared.");
      setFormData(prev => ({
        ...prev,
        thumbnailFile: null,
        // Keep existingThumbnail as is or clear based on your UI logic
        // Make sure clearThumbnail is handled if the file input is cleared without explicit button
      }));
    }
  };

  const handleClearThumbnail = () => {
    setFormData(prev => ({
      ...prev,
      thumbnailFile: null, // Clear any newly selected thumbnail file
      existingThumbnail: null, // Clear existing thumbnail display
      clearThumbnail: true, // Signal backend to delete
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // For adding new images, use newImageFiles, add to existing ones for preview
      setFormData(prev => ({
        ...prev,
        newImageFiles: Array.from(e.target.files!),
        clearExistingImages: false, // If new files are being added, likely not clearing all
      }));
    }
  };

  const handleRemoveExistingImage = (publicId: string) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img.public_id !== publicId),
      imagesToDelete: [...prev.imagesToDelete, publicId], // Mark for deletion
    }));
  };

  const handleClearAllExistingImages = () => {
    if (window.confirm('Are you sure you want to remove ALL existing additional images?')) {
      setFormData(prev => ({
        ...prev,
        existingImages: [],
        imagesToDelete: [...prev.imagesToDelete, ...prev.existingImages.map(img => img.public_id)], // Mark all for deletion
        newImageFiles: [], // Clear any pending new image uploads if clearing all
        clearExistingImages: true, // Set flag to send to backend
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('order', formData.order);
    // Append links only if they have a value (or explicit empty string to clear)
    data.append('githubLink', formData.githubLink || '');
    data.append('liveLink', formData.liveLink || '');

    // Technologies: ensure an empty string doesn't result in an empty array element
    formData.technologies.split(',')
      .map(tech => tech.trim())
      .filter(Boolean) // Filter out empty strings
      .forEach(tech => {
        data.append('technologies[]', tech);
      });

    console.log("2. SUBMIT: Current formData state for thumbnailFile:", formData.thumbnailFile);

    // Handle thumbnail
    if (formData.thumbnailFile) {
      data.append('thumbnail', formData.thumbnailFile);
      console.log("3. SUBMIT: Appended actual File object to FormData under 'thumbnail' key.");
    } else if (isEditMode && formData.clearThumbnail) {
      data.append('clearThumbnail', 'true');
      console.log("3. SUBMIT: Appended 'clearThumbnail' flag to FormData.");
    } else if (!isEditMode) { // In 'Add New Project' mode
        console.error("3. SUBMIT: ERROR! In 'Add New Project' mode, but formData.thumbnailFile is missing. Please select a thumbnail image.");
        setError("Thumbnail image is required for new projects. Please select one.");
        setLoading(false);
        return; // Stop submission
    } else { // In 'Edit Project' mode, no new thumbnail, not clearing existing
        console.log("3. SUBMIT: In 'Edit Project' mode, no new thumbnail provided, no clear flag. Will rely on existing backend thumbnail.");
    }


    // Handle new additional images
    formData.newImageFiles.forEach(file => {
      data.append('images', file); // Use 'images' as the field name for an array of files
    });

    // Handle image deletions for update
    if (isEditMode) { // Only relevant for updates
      // Mark images for individual deletion
      formData.imagesToDelete.forEach(publicId => {
        data.append('imagesToDelete[]', publicId); // Send public IDs to delete
      });

      // Handle the 'clear all existing images' flag
      if (formData.clearExistingImages) {
          data.append('clearImages', 'true'); // Backend expects 'clearImages'
      }
    }

    // Add this loop to inspect the FormData content *before* sending
    console.log("4. SUBMIT: Contents of FormData object BEFORE sending request:");
    for (const pair of data.entries()) {
    console.log(`${pair[0]}: `, pair[1]);
}

    try {
      if (initialProjectData) {
        // EDIT existing project
        console.log("5. SUBMIT: Sending PUT request to backend...");
        const response = await api.put(`/api/projects/${initialProjectData._id}`, data);
        setSuccess(response.data.message || 'Project updated successfully!');
      } else {
        // ADD new project
        console.log("5. SUBMIT: Sending POST request to backend...");
        const response = await api.post('/api/projects', data);
        setSuccess(response.data.message || 'Project added successfully!');
      }
      onProjectAddedOrUpdated(); // Notify parent to refresh list
    } catch (err: any) {
      console.error('Submission error:', err);
      // More specific error message if possible
      const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred during submission.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!initialProjectData; // Determine if in edit mode

  return (
    <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl border border-gray-700 max-w-4xl mx-auto">
      <h3 className="text-2xl sm:text-3xl font-bold text-primary-400 mb-6 text-center">
        {isEditMode ? 'Edit Project' : 'Add New Project'}
      </h3>

      {error && <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">{error}</div>}
      {success && <div className="bg-green-500 text-white p-3 rounded mb-4 text-center">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 resize-y"
            required
          ></textarea>
        </div>

        {/* Technologies (comma-separated) */}
        <div>
          <label htmlFor="technologies" className="block text-gray-300 text-sm font-bold mb-2">Technologies (comma-separated):</label>
          <input
            type="text"
            id="technologies"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            placeholder="e.g., React, MongoDB, Node.js"
            required
          />
        </div>

        {/* Category and Order (on one row for larger screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-gray-300 text-sm font-bold mb-2">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              required
            >
              <option value="">Select Category</option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="ui-ux">UI/UX</option>
              <option value="game">Game</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="order" className="block text-gray-300 text-sm font-bold mb-2">Display Order:</label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              placeholder="e.g., 1 (for first in list)"
              required
            />
          </div>
        </div>

        {/* Links (on one row for larger screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="githubLink" className="block text-gray-300 text-sm font-bold mb-2">GitHub Link (Optional):</label>
            <input
              type="url"
              id="githubLink"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              placeholder="https://github.com/your-project"
            />
          </div>
          <div>
            <label htmlFor="liveLink" className="block text-gray-300 text-sm font-bold mb-2">Live Link (Optional):</label>
            <input
              type="url"
              id="liveLink"
              name="liveLink"
              value={formData.liveLink}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              placeholder="https://your-live-project.com"
            />
          </div>
        </div>

        {/* Thumbnail Image */}
        <div>
          <label htmlFor="thumbnailFile" className="block text-gray-300 text-sm font-bold mb-2">Thumbnail Image (Required for new, optional for update):</label>
          {formData.existingThumbnail && (
            <div className="mb-2">
              <p className="text-gray-400 text-sm mb-1">Current Thumbnail:</p>
              <div className="relative inline-block">
                <img src={formData.existingThumbnail.url} alt="Current Thumbnail" className="max-w-[150px] max-h-[100px] object-cover rounded-md border border-gray-600" />
                <button
                  type="button"
                  onClick={handleClearThumbnail}
                  className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Remove current thumbnail"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
          {formData.thumbnailFile && (
            <div className="mb-2">
              <p className="text-gray-400 text-sm mb-1">New Thumbnail Preview:</p>
              <div className="relative inline-block">
                <img src={URL.createObjectURL(formData.thumbnailFile)} alt="New Thumbnail Preview" className="max-w-[150px] max-h-[100px] object-cover rounded-md border border-gray-600" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, thumbnailFile: null, clearThumbnail: false }))}
                  className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Remove new thumbnail selection"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
          <input
            type="file"
            id="thumbnailFile"
            name="thumbnail" // This is correct, matches backend Multer config
            accept="image/*"
            onChange={handleThumbnailChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
            required={!isEditMode || (!formData.thumbnailFile && !formData.existingThumbnail && !formData.clearThumbnail)} // Required if adding, OR if in edit mode and no current/new thumb, AND not explicitly cleared
          />
          {isEditMode && (
            <p className="text-gray-400 text-xs mt-1">
              {formData.existingThumbnail ? 'Select a new file to replace the current thumbnail, or click X to remove it.' : 'Thumbnail is optional for updates if one was previously uploaded and now cleared.'}
            </p>
          )}
        </div>

        {/* Additional Images */}
        <div>
          <label htmlFor="imageFiles" className="block text-gray-300 text-sm font-bold mb-2">Additional Images (Optional):</label>
          {formData.existingImages.length > 0 && (
            <div className="mb-3">
              <p className="text-gray-400 text-sm mb-1">Existing Images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-2">
                {formData.existingImages.map((img) => (
                  <div key={img.public_id} className="relative group w-full h-24 overflow-hidden rounded-md border border-gray-600">
                    <img src={img.url} alt="Project extra" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img.public_id)}
                      className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Remove image"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleClearAllExistingImages}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200"
              >
                Clear All Existing Images
              </button>
              <p className="text-gray-400 text-xs mt-1">
                Removing images here will mark them for deletion from Cloudinary upon save.
              </p>
            </div>
          )}
          {formData.newImageFiles.length > 0 && (
            <div className="mb-3">
              <p className="text-gray-400 text-sm mb-1">New Images Preview:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-2">
                {formData.newImageFiles.map((file, index) => (
                  <div key={file.name + index} className="relative group w-full h-24 overflow-hidden rounded-md border border-gray-600">
                    <img src={URL.createObjectURL(file)} alt={`New Project Image ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        newImageFiles: prev.newImageFiles.filter((_, i) => i !== index)
                      }))}
                      className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Remove new image selection"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <input
            type="file"
            id="imageFiles"
            name="images" // This is correct, matches backend Multer config
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
          />
          <p className="text-gray-400 text-xs mt-1">Select new files to add. Existing images will remain unless removed above.</p>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-center space-x-4 pt-4">
          <button
            type="submit"
            className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : (isEditMode ? <FaSave className="mr-2" /> : <FaPlus className="mr-2" />)}
            {loading ? 'Saving...' : (isEditMode ? 'Update Project' : 'Add Project')}
          </button>
          {isEditMode && onCancel && ( // Only show cancel in edit mode if onCancel prop is provided
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              disabled={loading}
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectManagementForm;