import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function HelpPage() {
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleQuestion = (index) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <main>

      <div className="bg-blue-500 text-white py-5 text-center mb-5">
        <h1 className="text-2xl font-bold m-0">Centro de ayuda</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">

          <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>

            <div className="flex flex-col gap-4">
              {[
                {
                  question: '¿Cómo funciona Campus Kruch?',
                  answer:
                    'Campus Kruch es una plataforma que permite a los estudiantes universitarios comprar y vender productos entre ellos. Puedes publicar tus productos, contactar a vendedores y gestionar tus favoritos.',
                },
                {
                  question: '¿Cómo contacto a un vendedor?',
                  answer:
                    'Para contactar a un vendedor, visita la página del producto que te interesa y completa el formulario de contacto. El vendedor recibirá tus datos y se pondrá en contacto contigo.',
                },
                {
                  question: '¿Cómo publico un producto?',
                  answer:
                    'Para publicar un producto, ve a la sección "Vender" en el menú principal. Completa el formulario con los detalles de tu producto, sube algunas fotos y listo.',
                },
                {
                  question: '¿Es seguro comprar en Campus Kruch?',
                  answer:
                    'Campus Kruch es una plataforma exclusiva para estudiantes universitarios. Te recomendamos siempre reunirte en lugares públicos dentro del campus para realizar intercambios y verificar los productos antes de pagar.',
                },
              ].map((faq, index) => (
                <div key={index} className="mb-4">
                  <div
                    className={`flex justify-between items-center p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors ${
                      openQuestions[index] ? 'rounded-b-none' : ''
                    }`}
                    onClick={() => toggleQuestion(index)}
                  >
                    <h3 className="font-medium">{faq.question}</h3>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        openQuestions[index] ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                  <div
                    className={`bg-white border border-gray-200 border-t-0 rounded-b-md overflow-hidden transition-all duration-300 ${
                      openQuestions[index]
                        ? 'max-h-48 p-3'
                        : 'max-h-0 p-0 border-transparent'
                    }`}
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>


          <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Contacto</h2>

            <p className="text-gray-700 mb-4">
              Si tienes alguna duda o problema que no se resuelve con las preguntas frecuentes, puedes contactarnos:
            </p>

            <ul className="flex flex-col gap-2">
              <li className="flex items-center">
                <span className="font-medium mr-2">Email:</span>
                <a
                  href="mailto:ayuda@campuskruch.com"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  ayuda@campuskruch.com
                </a>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Horario de atención:</span>
                <span>Lunes a viernes de 9:00 a 18:00</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}