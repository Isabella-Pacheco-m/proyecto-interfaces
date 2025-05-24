import React, { useState, useRef, useEffect } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard.jsx";
import { useProducts } from "../../Contexts/ProductContext";
import FilterBar from "../../Components/Filters/Filters.jsx";

export default function HomePage() {
  const { products, loading, error, filters, updateFilters, clearFilters } = useProducts();
  const [visibleProducts, setVisibleProducts] = useState(8);
  const hasMoreProducts = visibleProducts < products.length;

  const productSectionRef = useRef(null);

  // Esto resetea la cantidad de productos visibles al cambiar los filtros
  useEffect(() => {
    setVisibleProducts(8);
  }, [filters]);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // handlers para los filtros
  const handleSearch = (searchTerm) => {
    console.log("🔍 Búsqueda:", searchTerm);
    updateFilters({ searchTerm });
  };

  const handleFilterByTag = (tags) => {
    console.log("🏷️ Filtro por tags:", tags);
    updateFilters({ tags });
  };

  const handlePriceRangeChange = (min, max) => {
    console.log("💰 Rango de precio:", { min, max });
    updateFilters({ priceRange: { min, max } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg">Error cargando productos: {error}</div>
      </div>
    );
  }

  return (
    <main className="w-full">

      <section className="w-full relative overflow-hidden px-6 py-20 sm:py-28 flex items-center justify-center">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Descubre Productos Únicos
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explora nuestra amplia selección de productos de calidad de vendedores
            de confianza.
          </p>
          <button
            onClick={scrollToProducts}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-medium text-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            Ver Productos
          </button>
        </div>
        

        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white opacity-70"></div>
      </section>


      <section ref={productSectionRef} className="py-16 px-4">
        <div className="flex justify-center mb-8 max-w-7xl mx-auto">
          <FilterBar 
            onSearch={handleSearch}
            onTagFilter={handleFilterByTag}
            onPriceRangeChange={handlePriceRangeChange}
            currentFilters={filters}
          />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {filters.searchTerm || filters.tags.length > 0 || filters.priceRange.max < 100000
                ? "No hay productos que coincidan con los filtros seleccionados"
                : "No hay productos disponibles"
              }
            </p>
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto mb-4">
              <p className="text-sm text-gray-600">
                Mostrando {Math.min(visibleProducts, products.length)} de {products.length} productos
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {products.slice(0, visibleProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMoreProducts && (
              <div className="flex justify-center mt-8">
                <button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full font-medium transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={() => setVisibleProducts(visibleProducts + 8)}
                >
                  Cargar más ({products.length - visibleProducts} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}