import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API;


interface FeedbackDialogProps {
  onClose: () => void;
  isVisible: boolean;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  onClose,
  isVisible,
}) => {
  const [feedback, setFeedback] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("token");
  useEffect(() => {
    if (isVisible) {
      setIsActive(true);
    } else {
      setTimeout(() => setIsActive(false), 300);
    }
  }, [isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const date = new Date().toISOString();
    try {
      const response = await axios.post(`${API_URL}/createFeedback`, {
        description: feedback,
        createdAt: date,
      },{
        headers:{"x-auth-token":token}
      });
      console.log(response);
      if (response.status === 201) {
        // Feedback submitted successfully
        Cookies.set("isSubmitted", "true", { expires: 7 }); // Set cookie to expire in 1 year
        onClose();
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (err) {
      setError(
        "An error occurred while submitting feedback. Please try again."
      );
      console.error("Error submitting feedback:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isActive) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
        isVisible ? "visible" : "invisible"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg p-6 max-w-md w-full transform transition-all ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">We need your feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback..."
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackDialog;
