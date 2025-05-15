import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ServiceFormModal from "../../components/TutorDashboard/ServiceFormModal"; // Will create this next
import { toast } from "react-toastify";
import GlobalSpinner from "../../components/ui/GlobalSpinner";
import uniBazzarApi from "../../redux/api/uniBazzarApi"; // Assuming this is your API handler

const TutorServiceManagementPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint for fetching tutor services
      const response = await uniBazzarApi.get("/api/services/tutor-services/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast.error("Failed to fetch services. Please try again.");
      setServices([]); // Ensure services is an array even on error
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchServices();
    }
  }, [fetchServices, token]);

  const handleAddNewService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint for deleting a service
        await uniBazzarApi.delete(
          `/api/services/tutor-services/${serviceId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Service deleted successfully!");
        fetchServices(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete service:", error);
        toast.error("Failed to delete service. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleServiceSaved = () => {
    fetchServices();
    handleModalClose();
  };

  if (isLoading && services.length === 0) {
    return <GlobalSpinner />;
  }

  return (
    <div className="container mx-auto p-4 pt-20 md:pt-8">
      {" "}
      {/* Added pt-20 for navbar, md:pt-8 for larger screens */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Manage Your Services
        </h1>
        <button
          onClick={handleAddNewService}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center gap-2 cursor-pointer hover:drop-shadow-[0_5px_15px_rgba(59,130,246,0.5)]"
        >
          <FaPlus /> Add New Service
        </button>
      </div>
      {services.length === 0 && !isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You haven't added any services yet.
          </p>
          <button
            onClick={handleAddNewService}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:shadow-md transition duration-150 cursor-pointer"
          >
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price (ETB)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {service.title || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {service.description || "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {service.category || "General"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                    ETB {parseFloat(service.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.is_available // Assuming a field like 'is_available'
                          ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                      }`}
                    >
                      {service.is_available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditService(service)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mr-3 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-700/50 cursor-pointer hover:drop-shadow-[0_3px_10px_rgba(59,130,246,0.4)]"
                      aria-label="Edit Service"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-700/50 cursor-pointer hover:drop-shadow-[0_3px_10px_rgba(239,68,68,0.4)]"
                      aria-label="Delete Service"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
        <ServiceFormModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onServiceSaved={handleServiceSaved}
          service={editingService}
          token={token}
        />
      )}
    </div>
  );
};

export default TutorServiceManagementPage;
