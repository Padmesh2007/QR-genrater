import { Brain, Globe, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const features = [
  {
    titleKey: "feature1",
    descKey: "feature1Desc", 
    icon: Brain,
    gradient: "from-blue-500 to-purple-600"
  },
  {
    titleKey: "feature2",
    descKey: "feature2Desc",
    icon: Globe,
    gradient: "from-green-500 to-teal-600"
  },
  {
    titleKey: "feature3", 
    descKey: "feature3Desc",
    icon: Shield,
    gradient: "from-orange-500 to-red-600"
  },
  {
    titleKey: "feature4",
    descKey: "feature4Desc",
    icon: Zap,
    gradient: "from-purple-500 to-pink-600"
  }
];

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('uniqueFeatures')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced technology meets user-friendly design for reliable document verification
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.titleKey}
                className="verification-card text-center relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{t(feature.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {t(feature.descKey)}
                  </CardDescription>
                </CardContent>
                
                {/* Background decoration */}
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-r ${feature.gradient} opacity-5 rounded-full`} />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}