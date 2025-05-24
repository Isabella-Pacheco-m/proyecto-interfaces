import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ArrowUp } from "lucide-react";

export default function Footer() {
  const [emailSubscription, setEmailSubscription] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Suscrito:", emailSubscription);
    setEmailSubscription("");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/95 backdrop-blur-md shadow-inner mt-12 pt-12 pb-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-12">

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
   
            <div className="flex flex-col gap-4">
              <h3 className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold">
                Campus Kruch
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                La plataforma de compra y venta para estudiantes universitarios. Encuentra lo que necesitas o vende lo que ya no usas.
              </p>
              <div className="flex gap-4 mt-2">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>


            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">Enlaces rápidos</h4>
              <nav className="flex flex-col gap-2">
                {["vender", "favoritos", "pedidos", "ayuda", "perfil"].map((item) => (
                  <Link
                    key={item}
                    to={`/${item}`}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-all hover:translate-x-1"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Link>
                ))}
              </nav>
            </div>


            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">Categorías</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/categoria/electronica" className="text-sm text-gray-600 hover:text-purple-600 transition-all hover:translate-x-1">Electrónica</Link>
                <Link to="/categoria/libros" className="text-sm text-gray-600 hover:text-purple-600 transition-all hover:translate-x-1">Libros</Link>
                <Link to="/categoria/ropa" className="text-sm text-gray-600 hover:text-purple-600 transition-all hover:translate-x-1">Ropa</Link>
                <Link to="/categoria/comidas" className="text-sm text-gray-600 hover:text-purple-600 transition-all hover:translate-x-1">Comidas</Link>
                <Link to="/categorias" className="text-sm text-gray-600 hover:text-purple-600 transition-all hover:translate-x-1">Ver todas</Link>
              </nav>
            </div>


            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">Contacto</h4>
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-purple-600" />
                  <span>Cali, Colombia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-purple-600" />
                  <span>info@campuskruch.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-purple-600" />
                  <span>+57 300 123 4567</span>
                </div>
              </div>
            </div>
          </div>


          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-1">Suscríbete a nuestro boletín</h4>
            <p className="text-sm text-gray-600 mb-4">Recibe notificaciones sobre nuevos productos y ofertas especiales</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={emailSubscription}
                  onChange={(e) => setEmailSubscription(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Tu correo electrónico"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:scale-105 transition-transform"
              >
                Suscribirse
              </button>
            </form>
          </div>


          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-6 text-sm text-gray-500">
            <div>&copy; {currentYear} Campus Kruch. Todos los derechos reservados.</div>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <Link to="/terminos" className="hover:text-purple-600 transition-colors">Términos y Condiciones</Link>
              <Link to="/privacidad" className="hover:text-purple-600 transition-colors">Política de Privacidad</Link>
            </div>
          </div>


          <button
            onClick={scrollToTop}
            aria-label="Volver arriba"
            className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-gray-100 text-gray-700 shadow-md hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}
