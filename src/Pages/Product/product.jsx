import React from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../../Contexts/ProductContext";
import ProductGallery from "../../Components/ProductGallery/ProductGallery.jsx";
import ContactForm from "../../Components/ContactForm/ContactForm.jsx";
import CommentSection from "../../Components/CommentSection/CommentSection.jsx";

export default function ProductPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <main className="mx-auto px-4 py-8 max-w-[1200px]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

        <div className="flex flex-col gap-6">
          <ProductGallery images={product.images} />
          
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500">Vendido por: {product.seller}</p>
            
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>
        </div>


        <div className="relative">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">¿Interesado en este producto?</h2>
            <p className="text-gray-500 mb-6">
              Completa el formulario y el vendedor se pondrá en contacto contigo.
            </p>
            <ContactForm productId={product.id} />
          </div>
        </div>
      </div>


      <div className="mt-12">
        <CommentSection productId={product.id} />
      </div>
    </main>
  );
}