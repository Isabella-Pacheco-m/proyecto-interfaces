import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useProducts } from "../../Contexts/ProductContext";
import { useAuth } from "../../Contexts/authContext";
import { db } from "../../Firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function ProductCard({ product }) {
  const { isFavorite, toggleFavorite, fetchProducts } = useProducts();
  const { currentUser } = useAuth();
  const liked = isFavorite(product.id);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await deleteDoc(doc(db, "productos", product.id));
        await fetchProducts();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  const isOwner = currentUser?.email === product.seller;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <Link to={`/producto/${product.id}`} className="block">
      <div className="rounded-3xl overflow-hidden shadow-lg bg-white cursor-pointer hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-80 bg-gray-200 flex items-center justify-center">
          {(product.imageUrl || product.image_url) ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${product.imageUrl || product.image_url})` }}
              aria-label={product.imageAlt || `Imagen de producto - ${product.name}`}
              role="img"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <svg 
                className="w-12 h-12 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          <button
            onClick={handleLikeClick}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 ${
              liked 
                ? "bg-gradient-to-r from-pink-500 to-pink-400" 
                : "bg-white/20 backdrop-blur-md hover:bg-gradient-to-r hover:from-pink-500 hover:to-pink-400"
            }`}
          >
            <Heart
              size={20}
              className={liked ? "text-white fill-white" : "text-white"}
            />
          </button>

          {isOwner && (
            <button
              onClick={handleDelete}
              title="Eliminar producto"
              className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-red-500 hover:text-white text-red-600 rounded-full shadow"
            >
              <Trash2 size={18} />
            </button>
          )}

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-slate-800 text-base font-semibold mb-4">
            {product.name}
          </h3>

          <div className="flex flex-wrap gap-2 mb-5">
            {product.tags && product.tags.map((tag, index) => (
              <span
                key={index}
                className={`text-xs px-4 py-2 rounded-full ${
                  index % 3 === 0 
                    ? "bg-pink-100 text-pink-800" 
                    : index % 3 === 1 
                    ? "bg-purple-100 text-purple-800" 
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-pink-200 rounded-full blur-lg opacity-70"></div>
                <div className="h-8 w-8 rounded-full border-2 border-white shadow-md overflow-hidden relative z-10">
                  {product.sellerAvatar ? (
                    <img 
                      src={product.sellerAvatar} 
                      alt={`Avatar de ${product.seller}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                      {getInitials(product.seller)}
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-3 flex items-center">
                <span className="text-gray-600 text-xs mr-1">By</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-medium text-xs">
                  {product.seller}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}