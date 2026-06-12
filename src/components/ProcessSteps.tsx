import { Upload, ScanLine, Shield, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const steps = [
  {
    key: "step1",
    descKey: "step1Desc",
    icon: Upload,
    color: "text-blue-600"
  },
  {
    key: "step2",
    descKey: "step2Desc", 
    icon: ScanLine,
    color: "text-purple-600"
  },
  {
    key: "step3",
    descKey: "step3Desc",
    icon: Shield,
    color: "text-orange-600"
  },
  {
    key: "step4",
    descKey: "step4Desc",
    icon: CheckCircle2,
    color: "text-green-600"
  }
];

export function ProcessSteps() {
  const { t } = useLanguage();

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('howItWorks')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple 4-step process to verify any document in seconds
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 via-orange-600 to-green-600 opacity-20" />
            
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.key}
                  className="relative text-center fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Step number circle */}
                  <div className="relative mb-6">
                    <div className={cn(
                      "w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-gradient-to-br",
                      index === 0 && "from-blue-500 to-blue-600",
                      index === 1 && "from-purple-500 to-purple-600", 
                      index === 2 && "from-orange-500 to-orange-600",
                      index === 3 && "from-green-500 to-green-600"
                    )}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    
                    {/* Step number badge */}
                    <div className={cn(
                      "absolute -top-2 -right-2 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center",
                      index === 0 && "bg-blue-600",
                      index === 1 && "bg-purple-600",
                      index === 2 && "bg-orange-600", 
                      index === 3 && "bg-green-600"
                    )}>
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{t(step.key)}</h3>
                  <p className="text-muted-foreground text-sm">{t(step.descKey)}</p>

                  {/* Connection arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden mt-6 mb-2 text-muted-foreground">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-current to-transparent mx-auto opacity-30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}