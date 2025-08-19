import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  BarChart3, 
  Brain, 
  Target,
  Zap,
  Shield,
  FileText
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Growth Prediction",
    description: "AI-powered forecasting of your startup's growth trajectory for the next quarter.",
    badge: "ML Model",
    color: "text-success"
  },
  {
    icon: AlertTriangle,
    title: "Death Zone Detection",
    description: "Early warning system to identify failure risks before they become critical.",
    badge: "Risk Analysis",
    color: "text-warning"
  },
  {
    icon: DollarSign,
    title: "Profit/Loss Forecasting",
    description: "Accurate P&L predictions based on your current metrics and market conditions.",
    badge: "Financial ML",
    color: "text-primary"
  },
  {
    icon: BarChart3,
    title: "Cashflow & Runway",
    description: "Real-time tracking of burn rate, runway, and cashflow optimization strategies.",
    badge: "Live Tracking",
    color: "text-accent"
  },
  {
    icon: Brain,
    title: "AI Growth Playbook",
    description: "Personalized, actionable recommendations to accelerate your growth and avoid pitfalls.",
    badge: "AI Insights",
    color: "text-primary"
  },
  {
    icon: Target,
    title: "Investor CRM",
    description: "Built-in CRM to track investor relationships, grant opportunities, and partnerships.",
    badge: "Relationship Mgmt",
    color: "text-success"
  }
];

const stats = [
  { icon: Zap, label: "Prediction Accuracy", value: "99.9%" },
  { icon: Shield, label: "Startups Analyzed", value: "10K+" },
  { icon: FileText, label: "Success Rate", value: "94%" },
  { icon: Brain, label: "AI Recommendations", value: "1M+" }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            <Brain className="mr-2 h-4 w-4" />
            AI-Powered Analytics
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need to 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Scale Successfully</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From predictive analytics to actionable insights, ScaleLens gives you the tools to make data-driven decisions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 border-gray-200/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}