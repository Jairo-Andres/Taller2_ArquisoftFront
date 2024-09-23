import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bienvenido al Sistema de Gestión de Reservas para Eventos</h1>
      <p className="text-lg">
        Usa las opciones a continuación para crear eventos o hacer reservas.
      </p>
      <div className="space-y-4">
        <Link href="/create-event" className="block p-4 bg-blue-500 text-white rounded text-center">
          Crear un Evento
        </Link>
        <Link href="/make-reservation" className="block p-4 bg-green-500 text-white rounded text-center">
          Hacer una Reserva
        </Link>
        <Link href="/registrations" className="block p-4 bg-green-500 text-white rounded text-center">
          Ver personas registradas en los eventos
        </Link>
      </div>
    </div>
  );
}
