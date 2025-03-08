import React, { useState, useRef } from 'react';
import { Image, X } from 'lucide-react';

const TaskImagePicker = ({ onImageChange }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Crear URL para previsualización
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
        onImageChange(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Imagen</h3>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        ref={fileInputRef}
        className="hidden"
      />

      {!previewUrl ? (
        <button
          type="button"
          onClick={triggerFileInput}
          className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Haz clic para seleccionar una imagen
            </p>
          </div>
        </button>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Vista previa"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskImagePicker; 