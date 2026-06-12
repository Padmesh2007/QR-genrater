import { Button } from "@/components/ui/button";
import { useLanguage, type Language } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button
      variant="outline"
      onClick={toggleLanguage}
      className="transition-smooth hover:scale-105 font-medium"
    >
      {language === 'en' ? 'हिं' : 'EN'}
    </Button>
  );
}