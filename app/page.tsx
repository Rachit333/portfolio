"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  User,
  Code,
  Briefcase,
  ExternalLink,
  ArrowRight,
  Download,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);

      const sections = ["home", "about", "skills", "projects", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution built with Next.js and Stripe integration.",
      image:
        "/proj1.png",
      tech: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
      link: "https://piyush-p46.vercel.app/",
    },
    {
      title: "SpendWise",
      description:
        "A collaborative financial management tool with real-time expense tracking.",
      image:
        "/proj2.png",
      tech: ["React", "Node.js", "Socket.io", "MongoDB"],
      link: "#",
    },
    {
      title: "Weather Dashboard",
      description: "A weather forecasting application with interactive maps.",
      image:
        "/proj3.png",
      tech: ["React", "OpenWeather API", "Mapbox", "ChartJS"],
      link: "#",
    },
  ];

  const skills = [
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "React", level: 95 },
    { name: "Next.js", level: 88 },
    { name: "Node.js", level: 85 },
    { name: "Python", level: 80 },
    { name: "AWS", level: 75 },
    { name: "Docker", level: 78 },
  ];

  const NavLink = ({
    href,
    children,
    isActive,
  }: {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
  }) => (
    <a
      href={href}
      className={`px-4 py-2 rounded-full transition-colors ${
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
      }`}
    >
      {children}
    </a>
  );

  const Navigation = () => (
    <nav className="flex gap-2">
      <NavLink href="#home" isActive={activeSection === "home"}>
        Home
      </NavLink>
      <NavLink href="#about" isActive={activeSection === "about"}>
        About
      </NavLink>
      <NavLink href="#skills" isActive={activeSection === "skills"}>
        Skills
      </NavLink>
      <NavLink href="#projects" isActive={activeSection === "projects"}>
        Projects
      </NavLink>
      <NavLink href="#contact" isActive={activeSection === "contact"}>
        Contact
      </NavLink>
    </nav>
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Progress value={scrollProgress} className="rounded-none" />
      </div>

      {/* Navigation */}
      <header className="fixed top-4 left-0 w-full z-40 px-4">
        <div className="container mx-auto">
          <div className="bg-background/80 backdrop-blur-lg rounded-full border p-2 hidden md:block">
            <Navigation />
          </div>
          <div className="md:hidden flex justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80 backdrop-blur-lg"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <Navigation />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"
      >
        <div
          className="absolute inset-0 bg-grid-white/10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l9.9-9.9h-2.828zM32.657 0l-9.9 9.9 1.415 1.414L34.085 1.4 32.657 0zm-8.485 0L15.272 8.9 16.686 10.314 26.585.415 24.172 0zm-5.656 0L9.9 9.314 11.313 10.73l9.9-9.9h-2.828zm9.9 0l9.9 9.9 1.414-1.415L29.1.414 28.343 0zm8.485 0l9.9 9.9 1.415-1.414L37.928.414 36.828 0zm-4.242 0l7.07 7.07 1.415-1.414L33.686 0h-2.83zM42.485 0l7.07 7.07 1.415-1.415L43.9 0h-1.414zm-9.9 0l7.072 7.072 1.414-1.415L32.657 0h-2.829zM20.343 0L27.414 7.07l1.414-1.414L20.343 0zm-4.243 0l7.07 7.07 1.415-1.414L16.1 0h-2.83zm21.214 0L44.485 7.07l1.414-1.414L37.314 0h-2.829zm-9.9 0l7.072 7.072 1.414-1.415L27.414 0h-2.829zm-4.242 0l7.07 7.07 1.415-1.414L23.172 0h-2.83zM15.414 0l7.07 7.07 1.415-1.415L15.414 0zm21.214 0L43.7 7.07l1.415-1.415L36.628 0h-2.829zm-9.9 0l7.072 7.072 1.414-1.415L26.728 0h-2.829zm-4.242 0l7.07 7.07 1.415-1.414L22.485 0h-2.83z' fill='%23fff' fill-opacity='.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="container px-4 mx-auto text-center relative">
          <Image
            src="/profile.jpg"
            alt="Profile"
            className="w-40 h-40 rounded-full mx-auto mb-8 object-cover border-4 border-primary shadow-xl hover:scale-105 transition-transform duration-300"
            width={160}
            height={160}
          />
          <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Rachit Jasoria
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Full Stack Developer & UI/UX Enthusiast
          </p>

          <div className="flex justify-center gap-4">
            <Button
              variant="default"
              size="lg"
              className="group"
              onClick={() => window.open("/Rachit_CV SR 2.1.pdf", "_blank")}
            >
              Download CV
              <Download className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group"
              onClick={() => {
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:scale-110 transition-transform"
              asChild
            >
              <a
                href="https://github.com/Rachit333"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:scale-110 transition-transform"
              asChild
            >
              <a
                href="http://www.linkedin.com/in/rachit-jasoria"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:scale-110 transition-transform"
            >
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-background" id="about">
        <div className="container px-4 mx-auto">
          <div className="flex items-center gap-2 mb-12">
            <User className="h-6 w-6" />
            <h2 className="text-3xl font-bold">About Me</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I&#39;m a passionate Full Stack Developer with expertise in
                building web applications using modern technologies. I
                specialize in React, Node.js, and cloud platforms. My goal is to
                create efficient, scalable, and user-friendly applications that
                solve real-world problems.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I have a strong foundation in computer science with a B.Tech in
                Computer Science from LPU Punjab. When I&#39;m not coding, you
                can find me exploring new technologies, contributing to
                open-source projects, or sharing my knowledge through technical
                blog posts.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-4xl font-bold mb-2 text-primary">1.5+</h3>
                <p className="text-muted-foreground">
                  Years Freelance Experience
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-4xl font-bold mb-2 text-primary">20+</h3>
                <p className="text-muted-foreground">Projects Completed</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-4xl font-bold mb-2 text-primary">15+</h3>
                <p className="text-muted-foreground">Happy Clients</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-4xl font-bold mb-2 text-primary">100%</h3>
                <p className="text-muted-foreground">Client Satisfaction</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-32 bg-secondary/50" id="skills">
        <div className="container px-4 mx-auto">
          <div className="flex items-center gap-2 mb-12">
            <Code className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Skills & Expertise</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{skill.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {skill.level}%
                  </span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-32 bg-background" id="projects">
        <div className="container px-4 mx-auto">
          <div className="flex items-center gap-2 mb-12">
            <Briefcase className="h-6 w-6" />
            <h2 className="text-3xl font-bold">Featured Projects</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="group overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full group/btn">
                      View Project
                      <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 bg-secondary/50" id="contact">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Let&#39;s Work Together</h2>
            <p className="text-muted-foreground mb-8">
              I&#39;m always open to discussing new projects, creative ideas, or
              opportunities to be part of your visions.
            </p>
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Button size="lg" className="w-full group">
                  <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Email Me
                </Button>
                <Button size="lg" variant="outline" className="w-full group">
                  <Download className="mr-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                  Download CV
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-background border-t">
        <div className="container px-4 mx-auto text-center text-muted-foreground">
          <p>© 2024 Rachit Jasoria. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
