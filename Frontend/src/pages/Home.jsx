import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { CheckCircle, Users, Calendar, ChevronRight, ArrowRight, Star, Zap, BarChart3, Clock } from 'lucide-react';

function Home() {
  const { currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Animation trigger on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Task Management",
      role: "Core Feature",
      company: "Organization",
      content: "Create, assign, and track tasks effortlessly. Set priorities, deadlines, and custom statuses to keep projects on track."
    },
    {
      name: "Team Collaboration",
      role: "Communication",
      company: "Connectivity",
      content: "Real-time updates, comments, and mentions keep everyone in sync. Share files and feedback directly within tasks."
    },
    {
      name: "Progress Tracking",
      role: "Analytics",
      company: "Insights",
      content: "Visual dashboards and progress tracking help teams identify bottlenecks and optimize workflows for better efficiency."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50 overflow-x-hidden">
      {/* Hero Section with Animation */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div 
          className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-purple-100 p-8 md:p-12 mb-12 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="mb-6 inline-block p-3 bg-purple-100 rounded-full">
            <div className="bg-gradient-to-r from-purple-600 to-emerald-600 rounded-full p-2 text-white">
              <Zap size={28} className="animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-600 mb-6 leading-tight">
            CurTer
          </h1>
          
          <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            A collaborative project management platform that helps teams organize, track, and deliver exceptional work together
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="group flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-medium text-lg shadow-md hover:shadow-xl"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" size={20} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-medium text-lg shadow-md hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" size={20} />
                </Link>
              </>
            )}
          </div>
          
          {/* Stats Counter */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-xl font-bold text-purple-700">Connect</div>
              <div className="text-slate-600">Teams That Innovate Together</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl">
              <div className="text-xl font-bold text-emerald-700">Collaborate</div>
              <div className="text-slate-600">Work Smarter, Not Harder</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-xl font-bold text-purple-700">Create</div>
              <div className="text-slate-600">Turn Ideas Into Reality</div>
            </div>
          </div>
        </div>

        {/* Features Section with Staggered Animation */}
        <div 
          className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-purple-100 p-8 md:p-12 mb-12 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="text-3xl font-bold text-purple-900 text-center mb-10">
            Key Features & Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CheckCircle className="text-purple-600" />,
                title: "Project Management",
                description: "Create and manage projects with flexible boards and customizable workflows"
              },
              {
                icon: <Users className="text-emerald-600" />,
                title: "Team Collaboration",
                description: "Work together with your team in real-time with comments, mentions, and shared views"
              },
              {
                icon: <Calendar className="text-purple-600" />,
                title: "Task Organization",
                description: "Create, assign and track tasks across different statuses with powerful filtering"
              },
              {
                icon: <Zap className="text-emerald-600" />,
                title: "Workflow Automation",
                description: "Set up rules to automate your workflow processes and save valuable time"
              },
              {
                icon: <BarChart3 className="text-purple-600" />,
                title: "Advanced Analytics",
                description: "Track team performance with visual dashboards and custom reports"
              },
              {
                icon: <Clock className="text-emerald-600" />,
                title: "Time Tracking",
                description: "Monitor time spent on tasks and projects to optimize resource allocation"
              },
              {
                icon: <Star className="text-purple-600" />,
                title: "Priority Management",
                description: "Easily set and adjust priorities to focus on what matters most"
              },
              {
                icon: <CheckCircle className="text-emerald-600" />,
                title: "Custom Fields",
                description: "Add custom fields to tailor TaskBoard Pro to your specific needs"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 bg-white hover:bg-purple-50/30 transform hover:-translate-y-1 group"
                style={{ transitionDelay: `${100 * index}ms` }}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 group-hover:bg-emerald-100 mb-4 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-purple-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div 
          className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-purple-100 p-8 md:p-12 mb-12 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="text-3xl font-bold text-purple-900 text-center mb-10">
            What Our Users Say
          </h2>
          
          <div className="relative overflow-hidden h-64">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`absolute w-full transition-all duration-500 ease-in-out ${
                  index === activeTestimonial 
                    ? 'opacity-100 translate-x-0' 
                    : index < activeTestimonial 
                      ? 'opacity-0 -translate-x-full' 
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="bg-gradient-to-r from-purple-50 to-emerald-50 p-8 rounded-2xl border border-purple-100 max-w-3xl mx-auto">
                  <p className="text-lg text-slate-700 italic mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-emerald-400 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-purple-800">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-4 space-x-2">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial ? 'bg-purple-600 w-6' : 'bg-purple-200'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div 
          className={`bg-gradient-to-r from-purple-600 to-emerald-600 rounded-3xl shadow-lg p-8 md:p-12 text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="text-3xl text-white font-bold mb-6">Ready to transform your workflow?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of teams who have already improved their productivity with CurTer
          </p>
          
          {currentUser ? (
            <Link
              to="/dashboard"
              className="group inline-flex items-center bg-white text-purple-700 px-8 py-4 rounded-xl font-medium text-lg hover:bg-purple-50 transition-all duration-300 shadow-md"
            >
              Go to Dashboard
              <ChevronRight className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="group inline-flex items-center bg-white text-purple-700 px-8 py-4 rounded-xl font-medium text-lg hover:bg-purple-50 transition-all duration-300 shadow-md"
            >
              Start for Free
              <ChevronRight className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
