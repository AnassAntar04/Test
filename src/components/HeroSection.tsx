import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";

interface HeroSectionProps {
  onTabChange: (tab: "dashboard" | "chat" | "analytics") => void;
}

export const HeroSection = ({ onTabChange }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden py-16 px-4">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="SynergyAI Connect Hero" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-80"></div>
      </div>
      
      <div className="relative container mx-auto text-center text-white">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            Samy Conciergerie - Plateforme IA
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            SynergyAI Connect
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            Centralisez toutes vos conversations voyageurs avec une IA intelligente.<br />
            Airbnb • Booking • WhatsApp • Email - Une seule interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
              onClick={() => onTabChange("chat")}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Commencer le Chat
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3"
              onClick={() => onTabChange("analytics")}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Voir Analytics
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};