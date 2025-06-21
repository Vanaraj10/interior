// Storage utility for managing projects in localStorage
const STORAGE_KEY = 'interior_projects';

// Get all projects from localStorage
export const getProjects = () => {
  try {
    const projects = localStorage.getItem(STORAGE_KEY);
    return projects ? JSON.parse(projects) : [];
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
};

// Save a new project
export const saveProject = (project) => {
  try {
    const projects = getProjects();
    const newProject = {
      ...project,
      id: generateId(),
      createdAt: new Date().toISOString(),
      measurements: project.measurements || []
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return newProject;
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = (projectId, updatedProject) => {
  try {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updatedProject };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return projects[index];
    }
    throw new Error('Project not found');
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Get a single project by ID
export const getProject = (projectId) => {
  try {
    const projects = getProjects();
    return projects.find(p => p.id === projectId);
  } catch (error) {
    console.error('Error getting project:', error);
    return null;
  }
};

// Delete a project
export const deleteProject = (projectId) => {
  try {
    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate cloth meters required
export const calculateClothMeters = (heightInches, pieces) => {
  // Formula: ((height + 15) * pieces) / 39
  return ((heightInches + 15) * pieces) / 39;
};

// Calculate total cost
export const calculateTotalCost = (clothRatePerMeter, totalMeters, stitchingCost) => {
  const clothCost = clothRatePerMeter * totalMeters;
  return clothCost + stitchingCost;
};
