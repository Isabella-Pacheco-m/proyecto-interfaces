"use client"

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../Firebase/firebase"; 

export default function ContactForm({ productId }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "pedidos"), {
        ...formData,
        productId,
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      setFormData({ name: "", location: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg">
      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded text-center text-green-800">
          <h3 className="font-medium">¡Mensaje enviado!</h3>
          <p>El vendedor se pondrá en contacto contigo pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="location" className="block font-medium text-gray-700 mb-1">
              Ubicación en el campus
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-medium text-gray-700 mb-1">
              Mensaje (opcional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-2 px-4 rounded-md text-white font-medium transition-all duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-md hover:scale-[1.02]"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Contactar al vendedor"}
          </button>
        </form>
      )}
    </div>
  );
}
