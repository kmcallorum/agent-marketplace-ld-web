import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  noFooter?: boolean;
}

export function Layout({ children, fullWidth = false, noFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main
        className={
          fullWidth
            ? 'flex-1'
            : 'flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8'
        }
      >
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}
