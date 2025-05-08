import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const CONTENT_TYPE_MAP = {
  merchant: 21, // Update with your actual content type IDs
  student: 22,
  tutor: 23,
};

const API_BASE = "http://127.0.0.1:8000";

const ReviewSection = ({ type, objectId }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState(null);

  const contentTypeId = CONTENT_TYPE_MAP[type];

  // Fetch reviews for this product/service
  useEffect(() => {
    if (!contentTypeId || !objectId) return;
    setLoading(true);
    setError(null);
    fetch(
      `${API_BASE}/api/products/reviews/?content_type=${contentTypeId}&object_id=${objectId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load reviews");
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load reviews");
        setLoading(false);
      });
  }, [contentTypeId, objectId, token]);

  // Debug: log what is being sent on submit
  useEffect(() => {
    if (submitting) {
      console.log("Review submit payload:", {
        content_type: contentTypeId,
        object_id: objectId,
        rating: Number(form.rating),
        comment: form.comment.trim(),
      });
    }
  }, [submitting]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new or updated review
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/api/products/reviews/${editingId}/`
      : `${API_BASE}/api/products/reviews/`;
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content_type: contentTypeId,
        object_id: objectId,
        rating: form.rating,
        comment: form.comment,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to submit review");
        }
        return res.json();
      })
      .then(() => {
        setForm({ rating: 5, comment: "" });
        setEditingId(null);
        setSuccess(editingId ? "Review updated!" : "Review submitted!");
        // Refetch reviews
        return fetch(
          `${API_BASE}/api/products/reviews/?content_type=${contentTypeId}&object_id=${objectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
      .then((res) => res.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : data.results || []);
        setSubmitting(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to submit review");
        setSubmitting(false);
      });
  };

  // Edit review
  const handleEdit = (review) => {
    setForm({ rating: review.rating, comment: review.comment });
    setEditingId(review.id);
    setSuccess(null);
    setError(null);
  };

  // Delete review
  const handleDelete = (id) => {
    if (!window.confirm("Delete this review?")) return;
    setError(null);
    setSuccess(null);
    fetch(`${API_BASE}/api/products/reviews/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete review");
        setReviews(reviews.filter((r) => r.id !== id));
        setSuccess("Review deleted.");
      })
      .catch((err) => setError(err.message || "Failed to delete review"));
  };

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Product Reviews
      </h3>
      {loading && (
        <div className="text-gray-500 dark:text-gray-400">
          Loading reviews...
        </div>
      )}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}
      {!loading && !error && (
        <div className="space-y-6 mb-8">
          {reviews.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8 text-lg font-medium">
              No reviews yet.
            </div>
          )}
          <div className="flex flex-col gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col gap-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300 w-full"
              >
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src={
                      review.reviewer_profile_pic ||
                      "/assets/default_user_1.webp"
                    }
                    alt={review.reviewer_name || "User"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700 shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/default_user_1.webp";
                    }}
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-base">
                      {review.reviewer_name || "User"}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }
                        >
                          &#9733;
                        </span>
                      ))}
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {review.rating} / 5
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed mb-2 border-l-4 border-blue-200 dark:border-blue-700 pl-4 italic">
                  {review.comment}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString()
                      : ""}
                  </span>
                  {user && review.reviewer === user.id && (
                    <div className="flex gap-2">
                      <button
                        className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 shadow hover:shadow-blue-400/60 hover:scale-110 cursor-pointer"
                        title="Edit Review"
                        onClick={() => handleEdit(review)}
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/60 hover:scale-110 cursor-pointer"
                        title="Delete Review"
                        onClick={() => handleDelete(review.id)}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-lg shadow p-6"
        >
          <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            {editingId ? "Edit Your Review" : "Add a Review"}
          </h4>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Rating
            </label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="w-24 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Comment
            </label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition-colors cursor-pointer"
            disabled={submitting}
          >
            {editingId ? "Update Review" : "Submit Review"}
          </button>
          {editingId && (
            <button
              type="button"
              className="ml-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => {
                setEditingId(null);
                setForm({ rating: 5, comment: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      ) : (
        <div className="text-gray-500 dark:text-gray-400">
          Login to add a review.
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
