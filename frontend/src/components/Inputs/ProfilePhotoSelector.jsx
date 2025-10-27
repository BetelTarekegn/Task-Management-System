import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="relative">
        {/* Default icon or selected image */}
        {!previewUrl ? (
          <div className="w-18 h-18 bg-blue-100 rounded-full flex items-center justify-center">
            <LuUser className="text-4xl text-blue-500" />
          </div>
        ) : (
          <img
            src={previewUrl}
            alt="Profile"
            className="w-18 h-18 rounded-full object-cover"
          />
        )}

        {/* Upload button (bottom center) */}
        <button
          type="button"
          onClick={onChooseFile}
          className="absolute bottom-0 right-0 transform -translate-x-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition"
        >
          <LuUpload size={12} />
        </button>

        {/* Delete button (top right corner, only when image is selected) */}
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -bottom-0 -left-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition"
          >
            <LuTrash size={12} />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-2">Profile photo</p>
    </div>
  );
};

export default ProfilePhotoSelector;
