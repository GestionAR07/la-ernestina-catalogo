import './globals.css';
import { Manrope } from 'next/font/google';
import { OrderProvider } from '@/providers/OrderProvider';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'La Ernestina – Forrajería & Alimentos',
  description: 'Todo para tus mascotas y animales de granja',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={manrope.variable}>
      <body className="bg-background text-primary font-manrope">
        <OrderProvider>{children}</OrderProvider>
      </body>
    </html>
  );
}
