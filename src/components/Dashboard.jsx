import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../utils/storage';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getProjects();
    setProjects(allProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
      loadProjects();
    }
  };

  const getProjectSummary = (project) => {
    const measurements = project.measurements || [];
    const totalCost = measurements.reduce((sum, m) => sum + parseFloat(m.totalCost || 0), 0);
    const totalMeters = measurements.reduce((sum, m) => sum + parseFloat(m.totalMeters || 0), 0);
    return { totalCost, totalMeters, measurementCount: measurements.length };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interior Measurement & Quotation</h1>
            </div>
            <Link
              to="/new-project"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              + New Project
            </Link>
          </div>
        </div>

        {/* Statistics */}

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
          </div>

          {projects.length === 0 ? (
            null
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Measurements</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Cost</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => {
                    const summary = getProjectSummary(project);
                    return (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link
                            to={`/project/${project.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {project.clientName || 'Untitled Project'}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{project.phoneNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {summary.measurementCount} items
                          {summary.totalMeters > 0 && (
                            <div className="text-xs text-gray-600">{summary.totalMeters.toFixed(1)}m cloth</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ₹{summary.totalCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <Link
                              to={`/project/${project.id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
