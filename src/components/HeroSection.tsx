import { ArrowDown, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent-soft to-background" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and title */}
          <div className="fade-in-up mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 rounded-full bg-primary/10 glow-primary">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold gradient-text">
                VerifyWise AI
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              {t('welcome')}
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered document verification with multi-language support. 
              Secure, fast, and reliable authentication for all your certificates.
            </p>
          </div>

          {/* Key features */}
          <div className="bounce-in grid md:grid-cols-3 gap-6 mb-12" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center space-x-2 text-sm font-medium">
              <Zap className="h-5 w-5 text-success" />
              <span>Instant Verification</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm font-medium">
              <Shield className="h-5 w-5 text-primary" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm font-medium">
              <Users className="h-5 w-5 text-accent" />
              <span>Multi-Language Support</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="bounce-in flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              onClick={scrollToUpload}
              className="px-8 py-6 text-lg font-semibold transition-bounce hover:scale-105 glow-primary"
            >
              Start Verification
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('verify')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-6 text-lg font-semibold transition-bounce hover:scale-105"
            >
              Try QR Scanner
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="fade-in-up text-center" style={{ animationDelay: '0.9s' }}>
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by government agencies, law firms, and businesses worldwide
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-xs font-medium">🏛️ Government</div>
              <div className="text-xs font-medium">⚖️ Legal</div>
              <div className="text-xs font-medium">🏢 Enterprise</div>
              <div className="text-xs font-medium">👥 Citizens</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  );
}