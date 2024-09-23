import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'; // Importamos Link para la navegación
import "../app/globals.css";

// Definimos el tipo para los eventos
interface Event {
  id: string | null;
  title: string | null;
  availableSeats: string | null;
  date: string | null;
  location: string | null;
}

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    location: '',
    availableSeats: 0,
  });

  const [events, setEvents] = useState<Event[]>([]); // Estado para los eventos
  const [editingEventId, setEditingEventId] = useState<string | null>(null); // Estado para el ID del evento que se está editando

  // Función para obtener los eventos disponibles
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
      const dateRegex = /<date>(.*?)<\/date>/; // Expresión para 'date'
      const locationRegex = /<location>(.*?)<\/location>/; // Expresión para 'location'

      // Encontramos todos los eventos dentro del XML
      const eventsArray: Event[] = [];
      let match;

      while ((match = eventRegex.exec(rawXml)) !== null) {
        const eventData = match[1];

        // Extraemos los datos individuales del evento
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

        console.log('Processed event:', { id, title, availableSeats, date, location });

        // Añadimos el evento al array
        eventsArray.push({ id, title, availableSeats, date, location });
      }

      console.log('Final processed events array:', eventsArray);
      setEvents(eventsArray); // Actualizamos el estado con los eventos procesados
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const xmlData = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://localhost:3001/wsdl">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:${editingEventId ? 'updateEvent' : 'createEvent'}>
            ${editingEventId ? `<eventId>${editingEventId}</eventId>` : ''}
            <title>${eventData.title}</title>
            <date>${eventData.date}</date>
            <location>${eventData.location}</location>
            <availableSeats>${eventData.availableSeats}</availableSeats>
          </tns:${editingEventId ? 'updateEvent' : 'createEvent'}>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  
    try {
      await axios.post('http://localhost:3001/wsdl', xmlData, {
        headers: { 'Content-Type': 'text/xml' },
      });
      alert(editingEventId ? 'Evento actualizado con éxito.' : 'Evento creado con éxito.');
      setEditingEventId(null); // Limpiar el estado de edición después de guardar
      fetchEvents(); // Actualizar la lista de eventos después de crear o editar
    } catch (error) {
      console.error('Error al crear o editar el evento:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setEventData({
      title: event.title || '',
      date: event.date || '', // Asegurarnos de incluir la fecha
      location: event.location || '', // Asegurarnos de incluir la ubicación
      availableSeats: parseInt(event.availableSeats || '0', 10),
    });
    setEditingEventId(event.id); // Establecemos el ID del evento que se está editando
  };

  const handleDelete = async (eventId: string | null) => {
    const xmlData = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://localhost:3001/wsdl">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:deleteEvent>
            <eventId>${eventId}</eventId> <!-- Asegúrate de enviar eventId -->
          </tns:deleteEvent>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  
    try {
      await axios.post('http://localhost:3001/wsdl', xmlData, {
        headers: { 'Content-Type': 'text/xml' },
      });
      alert('Evento eliminado con éxito.');
      fetchEvents(); // Actualizar la lista de eventos después de eliminar
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-8" style={{ backgroundColor: "#9b9b9b" }}>
          <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--primary)" }}>
            {editingEventId ? 'Editar Evento' : 'Crear un Evento'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Título del evento:</label>
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa el título del evento"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Fecha del evento:</label>
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Ubicación:</label>
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa la ubicación"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Asientos disponibles:</label>
              <input
                type="number"
                name="availableSeats"
                value={eventData.availableSeats}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Número de asientos"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 primary-button"
            >
              {editingEventId ? 'Actualizar Evento' : 'Crear Evento'}
            </button>
          </form>
        </div>

        {/* Mostrar eventos disponibles */}
        <div className="mt-10 max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">Eventos Disponibles</h2>
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="bg-white p-4 shadow-md rounded-lg mb-4">
                <p><strong>ID del Evento:</strong> {event.id}</p>
                <p><strong>Nombre del Evento:</strong> {event.title}</p>
                <p><strong>Fecha:</strong> {event.date}</p> {/* Mostrar la fecha */}
                <p><strong>Ubicación:</strong> {event.location}</p> {/* Mostrar la ubicación */}
                <p><strong>Asientos Disponibles:</strong> {event.availableSeats}</p>
                <button
                  onClick={() => handleEdit(event)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <p>No hay eventos disponibles en este momento.</p>
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
