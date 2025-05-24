import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  HelpCircle,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../Contexts/authContext";

export default function Header() {
  const { userLoggedIn, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "/vender", icon: <ShoppingBag size={20} />, label: "Vender" },
    { to: "/favoritos", icon: <Heart size={20} />, label: "Favoritos" },
    { to: "/pedidos", icon: <ShoppingBag size={20} />, label: "Pedidos" },
    { to: "/ayuda", icon: <HelpCircle size={20} />, label: "Ayuda" },
  ];

  const mobileItems = [...navItems];

  return (
    <header className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 ${
      isScrolled ? "bg-white/98 backdrop-blur-lg" : ""
    }`}>
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <Link
            to="/"
            className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold mr-4 shrink-0"
          >
            Campus Kruch
          </Link>


          <nav className="hidden md:flex items-center gap-3">
            {navItems.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "text-purple-600 font-medium"
                      : "text-gray-800 hover:text-purple-600"
                  }`
                }
              >
                {icon}
                <span className="hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text">
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>


          <div className="flex items-center gap-4 ml-auto">


            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={toggleUserMenu}
                className="flex items-center gap-2 py-2 px-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <User size={20} className="text-gray-800" />
                {userLoggedIn ? (
                  <>
                    <span className="hidden sm:block text-sm font-medium truncate max-w-[120px]">
                      {currentUser?.email}
                    </span>
                    <ChevronDown size={16} className="text-gray-600" />
                  </>
                ) : (
                  <Link to="/login" className="hidden sm:block text-sm font-medium text-gray-800 hover:text-purple-600">
                    Iniciar sesión
                  </Link>
                )}
              </button>


              {isUserMenuOpen && userLoggedIn && (
                <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}

              {!userLoggedIn && (
                <Link 
                  to="/login" 
                  className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100"
                >
                  <User size={20} />
                </Link>
              )}
            </div>

            <button 
              onClick={toggleMenu} 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 ml-3"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>


        {isMenuOpen && (
          <div className="md:hidden px-4 py-3 border-t border-gray-200 bg-white/98 backdrop-blur-md">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Buscar..."
                />
              </div>
            </form>

            <nav className="flex flex-col gap-2">
              {mobileItems.map(({ to, icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "text-purple-600 font-medium bg-purple-50"
                        : "text-gray-800 hover:text-purple-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {icon}
                  <span className="hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text">
                    {label}
                  </span>
                </NavLink>
              ))}
              

              <div className="border-t border-gray-200 mt-2 pt-2">
                {userLoggedIn ? (
                  <>
                    <div className="p-3 text-sm text-gray-700">
                      <p className="font-medium">{currentUser?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 w-full text-left rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={20} />
                      <span>Cerrar sesión</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg text-purple-600 hover:bg-purple-50"
                  >
                    <User size={20} />
                    <span>Iniciar sesión</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
