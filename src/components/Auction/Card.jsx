import React from 'react';

const Card = ({ image, title, description, footer, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {image && (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{description}</p>
      </div>
      {footer && (
        <div className="px-4 py-3 border-t text-sm text-gray-500 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
