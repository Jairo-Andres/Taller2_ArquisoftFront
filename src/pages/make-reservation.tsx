import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import "../app/globals.css";

// Definimos el tipo para los eventos
interface Event {
  id: string | null;
  title: string | null;
  availableSeats: string | null;
}

export default function MakeReservation() {
  const [reservationData, setReservationData] = useState({
    name: '',
    email: '',
    seats: 0,
    eventId: '',
  });

  const [events, setEvents] = useState<Event[]>([]); // Estado para los eventos

  useEffect(() => {
    const fetchEvents = async () => {
      const xmlData = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://localhost:3001/wsdl">
          <soapenv:Header/>
          <soapenv:Body>
            <tns:getEvents/>
          </soapenv:Body>
        </soapenv:Envelope>
      `;
  
      try {
        const response = await axios.post('http://localhost:3001/wsdl', xmlData, {
          headers: { 'Content-Type': 'text/xml' },
        });
  
        const rawXml = response.data;
        console.log('Raw SOAP response:', rawXml);
  
        // Expresiones regulares para extraer los datos de los eventos
        const eventRegex = /<events>(.*?)<\/events>/g;
        const idRegex = /<id>(.*?)<\/id>/;
        const titleRegex = /<title>(.*?)<\/title>/;
        const availableSeatsRegex = /<availableSeats>(.*?)<\/availableSeats>/;
  
        // Encontramos todos los eventos dentro del XML
        const eventsArray: Event[] = [];
        let match;
  
        while ((match = eventRegex.exec(rawXml)) !== null) {
          const eventData = match[1];
  
          // Extraemos los datos individuales del evento
          const idMatch = idRegex.exec(eventData);
          const titleMatch = titleRegex.exec(eventData);
          const availableSeatsMatch = availableSeatsRegex.exec(eventData);
  
          const id = idMatch ? idMatch[1] : null;
          const title = titleMatch ? titleMatch[1] : null;
          const availableSeats = availableSeatsMatch ? availableSeatsMatch[1] : null;
  
          console.log('Processed event:', { id, title, availableSeats });
  
          // Verificamos si el evento con el mismo ID ya existe
          if (id && !eventsArray.some(event => event.id === id)) {
            // Si no existe, lo añadimos al array
            eventsArray.push({ id, title, availableSeats });
          }
        }
  
        console.log('Final processed events array:', eventsArray);
        setEvents(eventsArray); // Actualizamos el estado con todos los eventos procesados
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchEvents();
  }, []);
  
  
  
  
  
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReservationData({
      ...reservationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const xmlData = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://localhost:3001/wsdl">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:makeReservation>
            <name>${reservationData.name}</name>
            <email>${reservationData.email}</email>
            <seats>${reservationData.seats}</seats>
            <eventId>${reservationData.eventId}</eventId>
          </tns:makeReservation>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    try {
      await axios.post('http://localhost:3001/wsdl', xmlData, {
        headers: { 'Content-Type': 'text/xml' },
      });
      alert('Reserva realizada con éxito.');
    } catch (error) {
      console.error('Error al hacer la reserva:', error);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-blue-500 text-white py-4">
        <div className="container mx-auto flex justify-center items-center relative">
          {/* Botón Inicio */}
          <Link href="/" className="absolute left-0 bg-white text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-200 transition">
            Inicio
          </Link>
          <h1 className="text-2xl font-bold">Sistema de Gestión de Reservas para Eventos</h1>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-8" style={{ backgroundColor: "#9b9b9b" }}>
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--primary)" }}>Hacer una Reserva</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre:</label>
            <input 
              type="text" 
              name="name" 
              value={reservationData.name} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Ingresa tu nombre"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email:</label>
            <input 
              type="email" 
              name="email" 
              value={reservationData.email} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Ingresa tu correo electrónico"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Número de asientos:</label>
            <input 
              type="number" 
              name="seats" 
              value={reservationData.seats} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de asientos"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">ID del Evento:</label>
            <input 
              type="text" 
              name="eventId" 
              value={reservationData.eventId} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Ingresa el ID del evento"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 primary-button"
          >
            Reservar
          </button>
        </form>

        {/* Mostrar eventos disponibles */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Eventos Disponibles</h2>
          {events.length > 0 ? (
            events.map((event, index) => (
                <div key={index} className="bg-white p-4 shadow-md rounded-lg mb-4">
                <p><strong>ID del Evento:</strong> {event.id}</p>
                <p><strong>Nombre del Evento:</strong> {event.title}</p>
                <p><strong>Asientos Disponibles:</strong> {event.availableSeats}</p>
                </div>
            ))
            ) : (
            <p>No hay eventos disponibles en este momento.</p>
            )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-4 text-center mt-10">
        <p>© 2024 Sistema de Reservas</p>
      </footer>
    </>
  );
}
