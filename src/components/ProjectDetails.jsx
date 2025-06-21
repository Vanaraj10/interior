import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject, calculateClothMeters, calculateTotalCost } from '../utils/storage';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState({
    roomLabel: '',
    widthInches: '',
    heightInches: '',
    pieces: '',
    curtainType: 'Eyelet',
    clothRatePerMeter: '',
    stitchingCost: ''
  });

  const curtainTypes = ['Eyelet', 'Pleated', 'Rod Pocket'];

  useEffect(() => {
    const projectData = getProject(id);
    if (projectData) {
      setProject(projectData);
      setMeasurements(projectData.measurements || []);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateMeasurementTotals = (measurement) => {
    const heightInches = parseFloat(measurement.heightInches) || 0;
    const pieces = parseInt(measurement.pieces) || 0;
    const clothRatePerMeter = parseFloat(measurement.clothRatePerMeter) || 0;
    const stitchingCost = parseFloat(measurement.stitchingCost) || 0;

    const totalMeters = calculateClothMeters(heightInches, pieces);
    const totalCost = calculateTotalCost(clothRatePerMeter, totalMeters, stitchingCost);

    return { totalMeters, totalCost };
  };

  const handleAddMeasurement = (e) => {
    e.preventDefault();
    
    if (!newMeasurement.roomLabel || !newMeasurement.widthInches || !newMeasurement.heightInches || 
        !newMeasurement.pieces || !newMeasurement.clothRatePerMeter || !newMeasurement.stitchingCost) {
      alert('Please fill in all fields');
      return;
    }

    const { totalMeters, totalCost } = calculateMeasurementTotals(newMeasurement);
    
    const measurementWithId = {
      ...newMeasurement,
      id: Date.now().toString(),
      totalMeters: totalMeters.toFixed(2),
      totalCost: totalCost.toFixed(2),
      widthInches: parseFloat(newMeasurement.widthInches),
      heightInches: parseFloat(newMeasurement.heightInches),
      pieces: parseInt(newMeasurement.pieces),
      clothRatePerMeter: parseFloat(newMeasurement.clothRatePerMeter),
      stitchingCost: parseFloat(newMeasurement.stitchingCost)
    };

    const updatedMeasurements = [...measurements, measurementWithId];
    setMeasurements(updatedMeasurements);
    
    try {
      updateProject(id, { measurements: updatedMeasurements });
      setNewMeasurement({
        roomLabel: '',
        widthInches: '',
        heightInches: '',
        pieces: '',
        curtainType: 'Eyelet',
        clothRatePerMeter: '',
        stitchingCost: ''
      });
      setShowAddForm(false);
    } catch (error) {
      alert('Error saving measurement. Please try again.');
    }
  };

  const deleteMeasurement = (measurementId) => {
    if (window.confirm('Are you sure you want to delete this measurement?')) {
      const updatedMeasurements = measurements.filter(m => m.id !== measurementId);
      setMeasurements(updatedMeasurements);
      updateProject(id, { measurements: updatedMeasurements });
    }
  };

  const getTotalProjectCost = () => {
    return measurements.reduce((total, measurement) => total + parseFloat(measurement.totalCost), 0);
  };

  const getTotalClothMeters = () => {
    return measurements.reduce((total, measurement) => total + parseFloat(measurement.totalMeters), 0);
  };

  if (!project) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{project.projectTitle}</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Projects
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Client:</span> {project.clientName}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {project.phoneNumber}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {project.address && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Address:</span> {project.address}
            </div>
          )}
        </div>

        {/* Add Measurement Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Add Measurement
          </button>
        </div>

        {/* Add Measurement Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Measurement</h2>
            <form onSubmit={handleAddMeasurement} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room/Label *
                </label>
                <input
                  type="text"
                  name="roomLabel"
                  value={newMeasurement.roomLabel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bedroom Window 1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (inches) *
                </label>
                <input
                  type="number"
                  name="widthInches"
                  value={newMeasurement.widthInches}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Width in inches"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (inches) *
                </label>
                <input
                  type="number"
                  name="heightInches"
                  value={newMeasurement.heightInches}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Height in inches"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pieces *
                </label>
                <input
                  type="number"
                  name="pieces"
                  value={newMeasurement.pieces}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Number of pieces"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Curtain Type
                </label>
                <select
                  name="curtainType"
                  value={newMeasurement.curtainType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {curtainTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cloth Rate/Meter (₹) *
                </label>
                <input
                  type="number"
                  name="clothRatePerMeter"
                  value={newMeasurement.clothRatePerMeter}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rate per meter"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stitching Cost (₹) *
                </label>
                <input
                  type="number"
                  name="stitchingCost"
                  value={newMeasurement.stitchingCost}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Stitching cost"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Measurements Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Measurements & Quotation</h2>
          </div>

          {measurements.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No measurements added yet. Click "Add Measurement" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Room/Label</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Width</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Height</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Pieces</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cloth Meters</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate/Meter</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stitching</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Cost</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {measurements.map((measurement) => (
                    <tr key={measurement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{measurement.roomLabel}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{measurement.widthInches}"</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{measurement.heightInches}"</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{measurement.pieces}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{measurement.curtainType}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{measurement.totalMeters}m</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{measurement.clothRatePerMeter}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{measurement.stitchingCost}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{measurement.totalCost}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => deleteMeasurement(measurement.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          {measurements.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Total Cloth Required:</span> {getTotalClothMeters().toFixed(2)} meters
                </div>
                <div className="text-lg font-bold text-gray-900">
                  Total Project Cost: ₹{getTotalProjectCost().toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
