import { Users, Scale, Building, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const roles = [
  {
    key: "citizen",
    icon: Users,
    descKey: "citizenDesc"
  },
  {
    key: "lawyer", 
    icon: Scale,
    descKey: "lawyerDesc"
  },
  {
    key: "government",
    icon: Building,
    descKey: "governmentDesc"
  },
  {
    key: "business",
    icon: Briefcase,
    descKey: "businessDesc"
  }
];

export function RolesSection() {
  const { t } = useLanguage();

  return (
    <section id="roles" className="py-16">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Who Can Use VerifyWise?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform serves various stakeholders with tailored verification solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.key} 
                className="role-card text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{t(role.key)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {t(role.descKey)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}