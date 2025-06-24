
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef } from "react";

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#ffffff' : '#60a5fa'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = (100 - distance) / 100 * 0.2;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 relative overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)' }}
      />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-20 h-20 border border-blue-500/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 border-2 border-white/20 animate-bounce"></div>
        <div className="absolute bottom-20 right-32 w-8 h-8 bg-blue-400/30 rotate-12 animate-ping"></div>
        <div className="absolute top-32 left-1/2 w-24 h-24 border border-purple-400/20 rounded-full animate-pulse"></div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20 z-10"></div>

      <div className="max-w-4xl mx-auto text-center relative z-20">
        <div className="animate-fade-in">
          {/* Glowing Title */}
          <div className="relative mb-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent relative">
              Full Stack Developer
              <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent blur-sm opacity-50 animate-pulse"></div>
            </h1>
            
            {/* Animated underline */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 animate-expand-width"></div>
          </div>
          
          {/* Enhanced Description */}
          <div className="relative mb-8">
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              Passionate about creating <span className="text-blue-400 font-semibold">innovative solutions</span> and bringing ideas to life through code.
            </p>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Welcome to my portfolio showcasing <span className="text-purple-400 font-semibold">years of development experience</span>.
            </p>
          </div>
          
          {/* Enhanced Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 relative overflow-hidden group"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/50 text-white hover:bg-white hover:text-black transition-all duration-300 font-semibold px-8 py-4 text-lg backdrop-blur-sm bg-white/10 shadow-lg hover:shadow-white/25 transform hover:scale-105"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get In Touch
            </Button>
          </div>

          {/* Enhanced Social Links */}
          <div className="flex justify-center space-x-8 mb-16">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-3 rounded-full bg-white/5 backdrop-blur-sm hover:bg-blue-400/20">
              <Github size={28} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-3 rounded-full bg-white/5 backdrop-blur-sm hover:bg-blue-500/20">
              <Linkedin size={28} />
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-3 rounded-full bg-white/5 backdrop-blur-sm hover:bg-purple-400/20">
              <Mail size={28} />
            </a>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
            <ArrowDown className="text-gray-400 mx-auto mt-2" size={20} />
          </div>
        </div>
      </div>
    </section>
  );
};
