import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AlertTriangle, MapPin, Camera, ThumbsUp, AlertCircle, Navigation } from 'lucide-react';
import { fetchComplaints, createComplaint, voteComplaint, uploadImage, getDirections } from '../services/api';
import { Complaint, NewComplaint, Location } from '../types';

const ComplaintsSection: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [newComplaint, setNewComplaint] = useState<Omit<NewComplaint, 'imageUrl' | 'location'>>({
    title: '',
    description: '',
    category: 'infrastructure'
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery('complaints', fetchComplaints);

  const createMutation = useMutation(createComplaint, {
    onSuccess: () => {
      queryClient.invalidateQueries('complaints');
      setIsFormOpen(false);
      resetForm();
    }
  });

  const voteMutation = useMutation(voteComplaint, {
    onSuccess: () => {
      queryClient.invalidateQueries('complaints');
    }
  });

  const resetForm = () => {
    setNewComplaint({ title: '', description: '', category: 'infrastructure' });
    setSelectedImage(null);
    setImagePreview(null);
    setLocation(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
        }
      );
    }
  };

  const handleGetDirections = async (location: Location) => {
    try {
      const directions = await getDirections(location.latitude, location.longitude);
      window.open(directions.directions_url, '_blank');
    } catch (error) {
      console.error('Error getting directions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl;
    
    if (selectedImage) {
      const uploadResult = await uploadImage(selectedImage);
      imageUrl = uploadResult.url;
    }

    createMutation.mutate({
      ...newComplaint,
      imageUrl,
      location: location || undefined
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
        <p className="text-red-700">Failed to load complaints.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Community Complaints</h2>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-200"
        >
          {isFormOpen ? 'Cancel' : 'Report Issue'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newComplaint.title}
              onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newComplaint.description}
              onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newComplaint.category}
              onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="infrastructure">Infrastructure</option>
              <option value="safety">Safety</option>
              <option value="noise">Noise</option>
              <option value="sanitation">Sanitation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Photo
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Camera className="h-5 w-5 inline-block mr-2" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-md"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <MapPin className="h-5 w-5 inline-block mr-2" />
              {isGettingLocation ? 'Getting location...' : 'Use Current Location'}
            </button>
            {location && (
              <p className="mt-2 text-sm text-gray-600">
                Location set: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200"
          >
            {createMutation.isLoading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {data?.complaints.map((complaint: Complaint) => (
          <div
            key={complaint.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                complaint.status === 'open' ? 'bg-red-100 text-red-800' :
                complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {complaint.status}
              </span>
            </div>
            
            <p className="text-gray-600 mt-2">{complaint.description}</p>
            
            {complaint.imageUrl && (
              <img
                src={complaint.imageUrl}
                alt="Complaint"
                className="mt-3 rounded-md max-h-48 object-cover"
              />
            )}
            
            {complaint.location && (
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {complaint.location.latitude.toFixed(6)}, {complaint.location.longitude.toFixed(6)}
                  </span>
                </div>
                <button
                  onClick={() => handleGetDirections(complaint.location!)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  <span className="text-sm">Get Directions</span>
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Posted {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => voteMutation.mutate(complaint.id)}
                className="flex items-center space-x-1 text-gray-600 hover:text-orange-500"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{complaint.votes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComplaintsSection;