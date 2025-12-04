import React, { useState } from 'react';

export default function RatingModal({ isOpen, onClose, onSubmit, storeName, currentRating }) {
  const [rating, setRating] = useState(currentRating || 0);
  const [hover, setHover] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] shadow-2xl max-w-md w-full mx-4 animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Rate Store</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-300 mb-6">
            How would you rate <span className="font-semibold text-white">"{storeName}"</span>?
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transform transition-all duration-200 hover:scale-110 focus:outline-none"
              >
                <svg 
                  className={`w-12 h-12 ${
                    star <= (hover || rating) 
                      ? 'text-[#d4d4a8] fill-current' 
                      : 'text-gray-600'
                  } transition-colors duration-200`}
                  fill={star <= (hover || rating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={star <= (hover || rating) ? 0 : 2}
                  viewBox="0 0 24 24"
                >
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-center text-gray-400 mb-6">
              You selected: <span className="text-[#d4d4a8] font-semibold text-lg">{rating} star{rating > 1 ? 's' : ''}</span>
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-[#4d4d4d] text-gray-300 font-medium hover:bg-[#3d3d3d] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 px-4 py-3 rounded-lg bg-[#d4d4a8] text-[#1a1a1a] font-semibold hover:bg-[#c4c498] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentRating ? 'Update Rating' : 'Submit Rating'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
