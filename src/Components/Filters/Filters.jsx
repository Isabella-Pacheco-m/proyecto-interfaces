import React, { useState, useRef, useEffect } from "react";

export default function FilterBar({ 
  onSearch, 
  onTagFilter, 
  onPriceRangeChange, 
  currentFilters = { searchTerm: "", tags: [], priceRange: { min: 0, max: 100000 } }
}) {
  const [priceValue, setPriceValue] = useState(
    currentFilters.priceRange.max === Infinity ? 500000 : Math.min(currentFilters.priceRange.max || 50000, 500000)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    currentFilters.tags.length > 0 ? currentFilters.tags[0] : null
  );
  const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm || "");
  
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);

  const categories = [
    { id: "comidas", name: "Comidas", bgColor: "bg-green-100", textColor: "text-green-700", borderColor: "border-green-700" },
    { id: "libros", name: "Libros", bgColor: "bg-blue-100", textColor: "text-blue-700", borderColor: "border-blue-700" },
    { id: "electronica", name: "Electrónica", bgColor: "bg-purple-100", textColor: "text-purple-700", borderColor: "border-purple-700" },
    { id: "ropa", name: "Ropa", bgColor: "bg-red-100", textColor: "text-red-700", borderColor: "border-red-700" },
    { id: "manualidades", name: "Manualidades", bgColor: "bg-yellow-100", textColor: "text-yellow-700", borderColor: "border-yellow-700" },
  ];

  const calculateValue = (clientX) => {
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    let percentage = (clientX - rect.left) / rect.width;
    percentage = Math.min(1, Math.max(0, percentage));
    return Math.round(percentage * 500000);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setPriceValue(calculateValue(e.clientX));
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPriceValue(calculateValue(e.clientX));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setPriceValue(calculateValue(e.touches[0].clientX));
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setPriceValue(calculateValue(e.touches[0].clientX));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  useEffect(() => {
    if (thumbRef.current && sliderRef.current) {
      const percentage = (priceValue / 500000) * 100;
      thumbRef.current.style.left = `${percentage}%`;
    }
  }, [priceValue]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilters = () => {
    // Aplicar búsqueda
    if (onSearch) {
      onSearch(searchTerm);
    }
    
    // Aplicar filtro de categoría
    if (onTagFilter) {
      onTagFilter(activeCategory ? [activeCategory] : []);
    }
    
    // Aplicar rango de precio
    if (onPriceRangeChange) {
      onPriceRangeChange(0, priceValue);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory(null);
    setPriceValue(500000);
    
    if (onSearch) onSearch("");
    if (onTagFilter) onTagFilter([]);
    if (onPriceRangeChange) onPriceRangeChange(0, 500000);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col gap-4">
        {/* Barra de búsqueda */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Categorías */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 no-scrollbar md:flex-wrap md:gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap mr-2 md:mr-0 transition-all border ${category.textColor}
                  ${activeCategory === category.id 
                    ? `bg-transparent ${category.borderColor}` 
                    : `${category.bgColor} border-transparent hover:bg-transparent hover:${category.borderColor}`
                  }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Control de precio */}
            <div className="flex items-center gap-2">
              <span className="text-gray-800 font-medium whitespace-nowrap">Precio</span>
              <div className="relative w-32 md:w-48">
                <div 
                  ref={sliderRef}
                  className="relative h-6 w-full flex items-center cursor-pointer"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  <div className="absolute w-full h-1.5 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${(priceValue / 500000) * 100}%` }}
                    />
                  </div>
                  <div 
                    ref={thumbRef}
                    className={`absolute h-4 w-4 rounded-full bg-white border-2 border-purple-500 shadow-md transform -translate-x-1/2 z-10
                      ${isDragging ? 'scale-125 ring-2 ring-purple-200' : ''}`}
                  />
                </div>
              </div>
              <span className="text-gray-800 font-medium whitespace-nowrap">$ {priceValue.toLocaleString()}</span>
            </div>

            {/* Botones adicionales */}
            <div className="flex gap-2">
              <button 
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full font-medium transition-all duration-300 hover:bg-gray-50"
              >
                Limpiar
              </button>
              <button 
                onClick={applyFilters}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium px-6 py-2 rounded-full transition-all duration-300 shadow-md group"
              >
                <span className="relative z-10 group-hover:text-pink-600">
                  Aplicar Filtros
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
                <span className="absolute inset-0 border-2 border-transparent group-hover:border-purple-600 rounded-full transition-all duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}