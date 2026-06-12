import { Header } from '@/components/Header';
import QRGenerator from '@/components/QRGenerator';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <QRGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
