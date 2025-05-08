import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

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
    fetch(`${API_BASE}/api/products/reviews/?content_type=${contentTypeId}&object_id=${objectId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
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
        return fetch(`${API_BASE}/api/products/reviews/?content_type=${contentTypeId}&object_id=${objectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Product Reviews</h3>
      {loading && (
        <div className="text-gray-500 dark:text-gray-400">Loading reviews...</div>
      )}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded mb-4">{success}</div>
      )}
      {!loading && !error && (
        <div className="space-y-6 mb-8">
          {reviews.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400">No reviews yet.</div>
          )}
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between shadow"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}>&#9733;</span>
                    ))}
                  </span>
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{review.rating} / 5</span>
                </div>
                <p className="text-gray-700 dark:text-gray-200 mb-1">{review.comment}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reviewer: {review.reviewer_name || review.reviewer}</p>
              </div>
              {user && review.reviewer === user.id && (
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleEdit(review)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
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
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Rating</label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="w-24 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Comment</label>
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
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            disabled={submitting}
          >
            {editingId ? "Update Review" : "Submit Review"}
          </button>
          {editingId && (
            <button
              type="button"
              className="ml-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
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
        <div className="text-gray-500 dark:text-gray-400">Login to add a review.</div>
      )}
    </section>
  );
};

export default ReviewSection;