import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden bg-gradient-subtle">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="mr-2 h-4 w-4" />
            Your AI Co-Founder for Startup Success
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            Predict Your Startup's
            <span className="bg-gradient-hero bg-clip-text text-transparent block mt-2">
              Success Before It Happens
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            ScaleLens uses AI to predict profit/loss, growth trajectories, cashflow runway, and failure risks. 
            Get actionable insights to avoid the "death zone" and scale confidently.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            {user ? (
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="shadow-glow">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="elegant" size="xl" className="shadow-glow">
                    <Zap className="mr-2 h-5 w-5" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="glass" size="xl">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Try Live Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex justify-center mb-12">
            {user ? (
              <Link to="/addstartup">
                <Button variant="outline" size="lg">
                  Add Your Startup
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth?redirect=/addstartup">
                <Button variant="outline" size="lg">
                  Add Your Startup
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>99.9% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-warning" />
              <span>No External APIs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}