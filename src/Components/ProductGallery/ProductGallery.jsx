import { useState } from "react";

export default function ProductGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">

      <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-300 flex justify-center items-center">
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt="Imagen del producto"
          className="w-full h-full object-cover"
        />
      </div>


      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => {
          const isSelected = selectedImage === index;
          return (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-transform duration-200 ${
                isSelected
                  ? "border-transparent scale-110 bg-gradient-to-r from-purple-600 to-pink-600 p-0.5"
                  : "border-gray-300"
              }`}
            >
              <div className="w-full h-full rounded-[3px] overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover rounded-[3px]"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
