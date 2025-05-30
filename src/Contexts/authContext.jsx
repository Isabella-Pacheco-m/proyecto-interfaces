import React, { useContext, useState, useEffect } from "react";
import { auth } from "../Firebase/firebase"; 
import { GoogleAuthProvider, signOut } from "firebase/auth"; //se hace la utenticacion con google
import { onAuthStateChanged } from "firebase/auth"; // para tener rastros del de la autenticacion


//En este contexto se proporciona la gestion del estado de autenticacion, difetenciar si se inicia con google o email
// se provee acceso a los datos del usuario actual, y una funcion para cerrar sesion


const AuthContext = React.createContext(); //creacion del contexto de autenticacion

export function useAuth() { // Hook personalizado para acceder al contexto de autenticación
  return useContext(AuthContext);
}

export function AuthProvider({ children }) { // Proveedor de contexto de autenticación
  const [currentUser, setCurrentUser] = useState(null); // alacena los datos del usuario actual
  const [userLoggedIn, setUserLoggedIn] = useState(false); // booleano que indica si el usuario esta logueado
  const [isEmailUser, setIsEmailUser] = useState(false); // booleano que indica si el usuario se autentico con email
  const [isGoogleUser, setIsGoogleUser] = useState(false); // booleano que indica si el usuario se autentico con google
  const [loading, setLoading] = useState(true); // estado de carga para evitar renderizados prematuros


  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, initializeUser); // el inicializador de usuario se ejecuta cuando cambia el estado de autenticación 
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) { // se activa cuando hay un usuario autenticado
      setCurrentUser({ ...user });
      
      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password" // se verifica si el usuario se autentico con email
      );
      setIsEmailUser(isEmail);

      const isGoogle = user.providerData.some(
        (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID // se verifica si el usuario se autentico con google
      );
      setIsGoogleUser(isGoogle); // establece el estado de autenticacion del usuario

      setUserLoggedIn(true);
    } else { // se activa cuando no hay un usuario autenticado
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
      setIsGoogleUser(false); // resetea los estados de autenticacion a sus iniciales
    }
    setLoading(false); // indica que termino la verificacion incial 
  }

  const logout = async () => { // función para cerrar sesión usando signOut de Firebase
    try {
      await signOut(auth);
    } catch (error) { // manejos de errores durante el crre de sesión
      console.error("Error al cerrar sesión:", error);
    }
  };

  const value = { // conjunto de valores que se proporcionan a los componentes hijos
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
    userEmail: currentUser?.email || null,
    logout
  };

  return (
    <AuthContext.Provider value={value}> 
      {!loading && children} 
    </AuthContext.Provider>
  );
}