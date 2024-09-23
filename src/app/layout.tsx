import type { Metadata } from "next";
import localFont from "next/font/local";
import "../app/globals.css";

// Mantener las fuentes locales
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sistema de Gestión de Reservas para Eventos",
  description: "Aplicación para gestionar eventos y reservas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900 min-h-screen flex flex-col`}
      >
        <header className="bg-blue-500 p-4 text-white">
          <h1 className="text-2xl">Sistema de Gestión de Reservas para Eventos</h1>
        </header>
        {/* El 'flex-grow' permite que el main ocupe todo el espacio disponible */}
        <main className="container mx-auto p-4 flex-grow">{children}</main>
        <footer className="bg-blue-500 text-center text-white p-4">
          &copy; {new Date().getFullYear()} Sistema de Reservas
        </footer>
      </body>
    </html>
  );
}
