import React, { useState, useRef } from 'react';
import { User, Camera, X } from 'lucide-react';

const UserAvatar = ({ onAvatarChange }) => {
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        onAvatarChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {avatar ? (
          <div className="relative">
            <img
              src={avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User size={40} className="text-gray-500 dark:text-gray-400" />
          </div>
        )}
        
        <button
          type="button"
          onClick={triggerFileInput}
          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
        >
          <Camera size={16} />
        </button>
      </div>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarSelect}
        ref={fileInputRef}
        className="hidden"
      />
      
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {avatar ? 'Cambiar avatar' : 'Añadir avatar'}
      </p>
    </div>
  );
};

export default UserAvatar; 
