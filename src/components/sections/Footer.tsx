import { BarChart3, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "API Docs", href: "/docs" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "Startup Guide", href: "/guide" },
      { name: "Templates", href: "/templates" }
    ]
  }
];

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/scalelens" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/scalelens" },
  { name: "GitHub", icon: Github, href: "https://github.com/scalelens" },
  { name: "Email", icon: Mail, href: "mailto:hello@scalelens.ai" }
];

export function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ScaleLens</span>
            </div>
            <p className="text-accent-foreground/70 mb-6 max-w-sm">
              Your AI co-founder for predicting startup success. Make data-driven decisions and scale confidently.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <Button key={index} variant="ghost" size="icon" asChild>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-accent-foreground/70 hover:text-accent-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-accent-foreground/70 text-sm mb-4">
              Get the latest insights and updates.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button size="sm" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-accent-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-accent-foreground/60 text-sm">
            © 2025 ScaleLens. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-accent-foreground/60 hover:text-accent-foreground text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-accent-foreground/60 hover:text-accent-foreground text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-accent-foreground/60 hover:text-accent-foreground text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}