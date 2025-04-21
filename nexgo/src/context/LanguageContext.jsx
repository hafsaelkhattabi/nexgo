import React, { createContext, useState } from "react";

export const LanguageContext = createContext();

// Combined translations for Header, Hero, Opportunities, and Admin Dashboard components
const translations = {
  en: {
    home: "Home",
    partners: "Partners",
    services: "Services",
    about: "About Us",
    heroTitle: "Hungry? Order Your Favorite Food", 
    heroSubtitle: "Get it delivered to your doorstep",
    locationPlaceholder: "Enter your delivery location",
    chooseRestaurantButton: "Choose a Restaurant",
    opportunitiesTitle: "Opportunities",
    jobTitle: "Delivery with Us", // Updated for delivery
    jobDescription: "Join our team as a delivery person and be part of our adventure.", // Updated for delivery
    applyButton: "Sign Up", // Updated for delivery
    partnerTitle: "Become a Partner",
    partnerDescription: "Collaborate with us and grow your business.",
    registerButton: "Sign Up",
    deliveryTitle: "Your Favorite Restaurant Meals, Delivered to You",
    deliveryDescription: "Order now and enjoy home delivery.",
    orderButton: "Order Now",
    adminDashboard: "Admin Dashboard",
    restaurants: "Restaurants",
    addRestaurant: "Add Restaurant",
    orderPageTitle: "Place Your Order",
    name: "Name",
    namePlaceholder: "Enter your name",
    address: "Address",
    addressPlaceholder: "Enter your delivery address",
    phoneNumber: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    orderDetails: "Order Details",
    orderDetailsPlaceholder: "Enter your order details",
    submitOrder: "Submit Order",
    deliveryApplicationTitle: "Delivery Application",
    name: "Name",
    namePlaceholder: "Enter your name",
    email: "Email",
    emailPlaceholder: "Enter your email",
    phoneNumber: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    resume: "Resume",
    submitApplication: "Submit Application",
  },
  fr: {
    home: "Accueil",
    partners: "Partenaires",
    services: "Services",
    about: "À Propos",
    heroTitle: "Faim ? Commandez votre nourriture préférée", 
    heroSubtitle: "Livraison à votre porte",
    locationPlaceholder: "Entrez votre adresse de livraison",
    chooseRestaurantButton: "Choisir un Restaurant",
    opportunitiesTitle: "Opportunités",
    jobTitle: "Livraison avec Nous", // Updated for delivery
    jobDescription: "Rejoignez notre équipe en tant que livreur et faites partie de notre aventure.", // Updated for delivery
    applyButton: "S'inscrire", // Updated for delivery
    partnerTitle: "Devenir Partenaire",
    partnerDescription: "Collaborez avec nous et développez votre entreprise.",
    registerButton: "S'inscrire",
    deliveryTitle: "Les plats de vos restaurants préférés, livrés chez vous",
    deliveryDescription: "Commandez dès maintenant et profitez de la livraison à domicile.",
    orderButton: "Commander",
    adminDashboard: "Tableau de Bord Admin",
    restaurants: "Restaurants",
    addRestaurant: "Ajouter un Restaurant",
    orderPageTitle: "Passer Votre Commande",
    name: "Nom",
    namePlaceholder: "Entrez votre nom",
    address: "Adresse",
    addressPlaceholder: "Entrez votre adresse de livraison",
    phoneNumber: "Numéro de Téléphone",
    phonePlaceholder: "Entrez votre numéro de téléphone",
    orderDetails: "Détails de la Commande",
    orderDetailsPlaceholder: "Entrez les détails de votre commande",
    submitOrder: "Soumettre la Commande",
    deliveryApplicationTitle: "Candidature pour Livraison",
    name: "Nom",
    namePlaceholder: "Entrez votre nom",
    email: "Email",
    emailPlaceholder: "Entrez votre email",
    phoneNumber: "Numéro de Téléphone",
    phonePlaceholder: "Entrez votre numéro de téléphone",
    resume: "CV",
    submitApplication: "Soumettre la Candidature",
  },
  es: {
    home: "Inicio",
    partners: "Socios",
    services: "Servicios",
    about: "Sobre Nosotros",
    heroTitle: "¿Hambriento? Pide tu comida favorita", 
    heroSubtitle: "Entrega a domicilio",
    locationPlaceholder: "Ingresa tu dirección de entrega",
    chooseRestaurantButton: "Elegir un Restaurante",
    opportunitiesTitle: "Oportunidades",
    jobTitle: "Entrega con Nosotros", // Updated for delivery
    jobDescription: "Únete a nuestro equipo como repartidor y sé parte de nuestra aventura.", // Updated for delivery
    applyButton: "Registrarse", // Updated for delivery
    partnerTitle: "Convertirse en Socio",
    partnerDescription: "Colabora con nosotros y haz crecer tu negocio.",
    registerButton: "Registrarse",
    deliveryTitle: "Tus platos favoritos de restaurantes, entregados en tu puerta",
    deliveryDescription: "Ordena ahora y disfruta de la entrega a domicilio.",
    orderButton: "Ordenar Ahora",
    adminDashboard: "Panel de Administración",
    restaurants: "Restaurantes",
    addRestaurant: "Agregar Restaurante",
    orderPageTitle: "Realizar Pedido",
    name: "Nombre",
    namePlaceholder: "Ingresa tu nombre",
    address: "Dirección",
    addressPlaceholder: "Ingresa tu dirección de entrega",
    phoneNumber: "Número de Teléfono",
    phonePlaceholder: "Ingresa tu número de teléfono",
    orderDetails: "Detalles del Pedido",
    orderDetailsPlaceholder: "Ingresa los detalles de tu pedido",
    submitOrder: "Enviar Pedido",
    deliveryApplicationTitle: "Solicitud de Entrega",
    name: "Nombre",
    namePlaceholder: "Ingresa tu nombre",
    email: "Correo Electrónico",
    emailPlaceholder: "Ingresa tu correo electrónico",
    phoneNumber: "Número de Teléfono",
    phonePlaceholder: "Ingresa tu número de teléfono",
    resume: "Currículum",
    submitApplication: "Enviar Solicitud",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default language

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
