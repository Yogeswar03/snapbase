import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Building } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    description: "Perfect for early-stage startups to get started",
    badge: "",
    features: [
      "Basic dashboard",
      "1 startup profile",
      "Monthly predictions",
      "Growth playbook",
      "Email support"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Pro",
    icon: Crown,
    price: "$79",
    period: "per month",
    description: "For scaling startups that need advanced insights",
    badge: "Most Popular",
    features: [
      "Advanced analytics",
      "3 startup profiles",
      "Real-time predictions",
      "AI Growth Playbook",
      "Death zone alerts",
      "Investor CRM",
      "Priority support",
      "Custom reports"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "hero" as const,
    popular: true
  },
  {
    name: "Enterprise",
    icon: Building,
    price: "$169",
    period: "per month",
    description: "For venture studios and accelerators",
    badge: "",
    features: [
      "Everything in Pro",
      "Unlimited startups",
      "White-label dashboard",
      "API access",
      "Custom ML models",
      "Dedicated support",
      "SSO & advanced security",
      "Team collaboration"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "elegant" as const,
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            <Crown className="mr-2 h-4 w-4" />
            Simple Pricing
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Choose Your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Growth Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative shadow-card hover:shadow-elegant transition-all duration-300 ${
                plan.popular ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-hero text-primary-foreground px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-lg ${plan.popular ? 'bg-gradient-primary' : 'bg-muted'}`}>
                    <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`} />
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/auth" className="block">
                  <Button 
                    variant={plan.buttonVariant} 
                    className="w-full"
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Need something custom? We're here to help.
          </p>
          <Button variant="ghost">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}