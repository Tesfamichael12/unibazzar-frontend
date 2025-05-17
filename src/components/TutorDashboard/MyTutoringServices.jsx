import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { CardContainer, CardBody, CardItem } from "../ui/3d-card";
import {
  Pencil,
  Trash2,
  PlusCircle,
  Phone,
  BookOpen,
  BadgeDollarSign,
  University,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../redux/api/uniBazzarApi";
import ServiceModal from "./ServiceModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import Spinner from "../ui/Spinner";

export default function MyTutoringServices() {
  const { user } = useSelector((state) => state.auth);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    api
      .get(`/api/users/${user.id}/listings/`)
      .then((res) => {
        setServices(res.data.tutor_services || []);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSave = async (serviceData) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (editingService) {
        response = await api.patch(
          `/api/products/tutor-services/${editingService.id}/`,
          serviceData
        );
      } else {
        response = await api.post("/api/products/tutor-services/", serviceData);
      }
      toast.success(
        `Service ${editingService ? "updated" : "added"} successfully!`
      );
      // Refresh list
      const res = await api.get(`/api/users/${user.id}/listings/`);
      setServices(res.data.tutor_services || []);
      setIsModalOpen(false);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const service = services.find((s) => s.id === id);
    setDeleteModal({
      open: true,
      id,
      name: service?.subject || "this service",
    });
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/products/tutor-services/${deleteModal.id}/`);
      setServices((prev) => prev.filter((s) => s.id !== deleteModal.id));
      toast.success("Service deleted.");
    } catch (err) {
    } finally {
      setLoading(false);
      setDeleteModal({ open: false, id: null, name: "" });
    }
  };

  return (
    <div className="p-3 sm:pt-6 min-h-screen bg-transparent">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-lg">
          My Tutoring Services
        </h2>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 px-4 sm:px-5 py-2 rounded-xl shadow-lg hover:from-green-500 hover:to-green-700 transition font-semibold text-base sm:text-lg text-white cursor-pointer"
        >
          <PlusCircle size={20} className="sm:hidden" />
          <PlusCircle size={22} className="hidden sm:inline" />
          <span className="hidden lg:inline">Add Tutoring Service</span>
        </motion.button>
      </div>
      {loading && <Spinner size="lg" />}
      {error && (
        <div className="text-red-600 dark:text-red-400 mb-4 font-semibold text-base sm:text-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        <AnimatePresence>
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <CardContainer className="hover:shadow-2xl group h-full">
                <CardBody className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden relative flex flex-col h-full p-3 sm:p-5">
                  <div className="relative h-32 sm:h-44 w-full rounded-xl overflow-hidden mb-3 sm:mb-4">
                    <img
                      src={service.banner_photo}
                      alt={
                        service.description?.slice(0, 20) || "Service Banner"
                      }
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardItem>
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <BookOpen
                        className="text-blue-500 dark:text-blue-300"
                        size={18}
                      />
                      <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {service.category?.name || "Tutoring"}
                      </span>
                    </div>
                    <div className="text-base sm:text-xl font-semibold mb-1 text-gray-900 dark:text-white break-words">
                      {service.description}
                    </div>
                  </CardItem>
                  <CardItem>
                    <div className="flex flex-col gap-1 text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <BadgeDollarSign
                          className="text-green-500 dark:text-green-300"
                          size={16}
                        />
                        <span className="font-bold">Rate:</span>
                        <span className="text-green-700 dark:text-green-200">
                          {service.price} ETB/hr
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone
                          className="text-blue-600 dark:text-blue-300"
                          size={16}
                        />
                        <span className="font-bold">Phone:</span>
                        <span>{service.phone_number}</span>
                      </div>
                      {service.university && (
                        <div className="flex items-center gap-2">
                          <University
                            className="text-blue-600 dark:text-blue-300"
                            size={16}
                          />
                          <span className="font-bold">University:</span>
                          <span>{service.university}</span>
                        </div>
                      )}
                    </div>
                  </CardItem>
                  <div className="flex gap-2 sm:gap-3 mt-auto pt-3 sm:pt-4">
                    <motion.button
                      whileHover={{ scale: 1.15, backgroundColor: "#2563eb" }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg transition cursor-pointer"
                      onClick={() => handleEdit(service)}
                      title="Edit Service"
                      type="button"
                      style={{ cursor: "pointer" }}
                    >
                      <Pencil size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15, backgroundColor: "#dc2626" }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition cursor-pointer"
                      onClick={() => handleDelete(service.id)}
                      title="Delete Service"
                      type="button"
                      style={{ cursor: "pointer" }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingService={editingService}
      />
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, id: null, name: "" })}
        onConfirm={confirmDelete}
        itemName={deleteModal.name}
      />
    </div>
  );
}
