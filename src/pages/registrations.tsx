import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'; // Importamos Link para la navegación
import "../app/globals.css";

interface Event {
  id: string | null;
  title: string | null;
  availableSeats: string | null;
  date: string | null;
  location: string | null;
}

interface Registration {
  id: string;
  name: string;
  email: string;
  seats: number;
}

export default function EventRegistrations() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // Obtener eventos
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

        // Expresiones regulares para extraer los datos de los eventos
        const eventRegex = /<events>(.*?)<\/events>/g;
        const idRegex = /<id>(.*?)<\/id>/;
        const titleRegex = /<title>(.*?)<\/title>/;
        const availableSeatsRegex = /<availableSeats>(.*?)<\/availableSeats>/;
        const dateRegex = /<date>(.*?)<\/date>/;
        const locationRegex = /<location>(.*?)<\/location>/;

        const eventsArray: Event[] = [];
        let match;

        while ((match = eventRegex.exec(rawXml)) !== null) {
          const eventData = match[1];
          const idMatch = idRegex.exec(eventData);
          const titleMatch = titleRegex.exec(eventData);
          const availableSeatsMatch = availableSeatsRegex.exec(eventData);
          const dateMatch = dateRegex.exec(eventData);
          const locationMatch = locationRegex.exec(eventData);

          const id = idMatch ? idMatch[1] : null;
          const title = titleMatch ? titleMatch[1] : null;
          const availableSeats = availableSeatsMatch ? availableSeatsMatch[1] : null;
          const date = dateMatch ? dateMatch[1] : null;
          const location = locationMatch ? locationMatch[1] : null;

          eventsArray.push({ id, title, availableSeats, date, location });
        }

        setEvents(eventsArray);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Obtener registros de personas para el evento seleccionado
  const fetchRegistrations = async (eventId: string) => {
    const xmlData = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://localhost:3001/wsdl">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:getRegistrations>
            <eventId>${eventId}</eventId>
          </tns:getRegistrations>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    try {
      const response = await axios.post('http://localhost:3001/wsdl', xmlData, {
        headers: { 'Content-Type': 'text/xml' },
      });

      const rawXml = response.data;

      // Expresiones regulares para extraer los datos de las personas registradas
      const registrationRegex = /<registrations>(.*?)<\/registrations>/g;
      const idRegex = /<id>(.*?)<\/id>/;
      const nameRegex = /<name>(.*?)<\/name>/;
      const emailRegex = /<email>(.*?)<\/email>/;
      const seatsRegex = /<seats>(.*?)<\/seats>/;

      const registrationsArray: Registration[] = [];
      let match;

      while ((match = registrationRegex.exec(rawXml)) !== null) {
        const registrationData = match[1];
        const idMatch = idRegex.exec(registrationData);
        const nameMatch = nameRegex.exec(registrationData);
        const emailMatch = emailRegex.exec(registrationData);
        const seatsMatch = seatsRegex.exec(registrationData);

        const id = idMatch ? idMatch[1] : '';
        const name = nameMatch ? nameMatch[1] : '';
        const email = emailMatch ? emailMatch[1] : '';
        const seats = seatsMatch ? parseInt(seatsMatch[1], 10) : 0;

        registrationsArray.push({ id, name, email, seats });
      }

      setRegistrations(registrationsArray);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleEventSelection = (event: Event) => {
    setSelectedEvent(event);
    fetchRegistrations(event.id!);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-500 text-white py-4">
        <div className="container mx-auto flex justify-center items-center relative">
          <Link href="/" className="absolute left-0 bg-white text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-200 transition">
            Inicio
          </Link>
          <h1 className="text-2xl font-bold">Consulta de Personas Registradas</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex">
        {/* Columna izquierda: Lista de eventos */}
        <div className="w-1/2 p-4">
          <h2 className="text-xl font-bold mb-4">Eventos Disponibles</h2>
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="bg-white p-4 shadow-md rounded-lg mb-4">
                <p><strong>ID del Evento:</strong> {event.id}</p>
                <p><strong>Nombre del Evento:</strong> {event.title}</p>
                <p><strong>Fecha:</strong> {event.date}</p>
                <p><strong>Ubicación:</strong> {event.location}</p>
                <button
                  onClick={() => handleEventSelection(event)}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg mt-2"
                >
                  Ver Personas Registradas
                </button>
              </div>
            ))
          ) : (
            <p>No hay eventos disponibles en este momento.</p>
          )}
        </div>

        {/* Columna derecha: Lista de personas registradas */}
        <div className="w-1/2 p-4">
          <h2 className="text-xl font-bold mb-4">Personas Registradas</h2>
          {registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Nombre</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Asientos Reservados</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">{registration.id}</td>
                      <td className="py-2 px-4 border">{registration.name}</td>
                      <td className="py-2 px-4 border">{registration.email}</td>
                      <td className="py-2 px-4 border">{registration.seats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>{selectedEvent ? 'No hay personas registradas en este evento.' : 'Selecciona un evento para ver los registros.'}</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-4 mt-10">
        <div className="container mx-auto text-center">
          <p>© 2024 Sistema de Reservas</p>
        </div>
      </footer>
    </div>
  );
}
