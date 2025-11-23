import { QrCode, Smartphone, LayoutDashboard, Globe, ShieldCheck, Zap, Users, BarChart, Settings } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Smartphone,
      title: "Guest App - No Download Required",
      description: "Guests scan and order instantly. A modern, fast interface that works on any smartphone without installation.",
    },
    {
      icon: LayoutDashboard,
      title: "Staff Command Center",
      description: "All requests in one place. Real-time task management, staff notifications, and execution tracking.",
    },
    {
      icon: Globe,
      title: "Auto-Translate to 30+ Languages",
      description: "Guests order in French, staff receives in English. Breaking the language barrier automatically.",
    },
    {
      icon: QrCode,
      title: "Smart QR Management",
      description: "Generate unique codes for each room or area. Update menus and services in real-time without reprinting.",
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Understand guest behavior, peak times, staff performance, and most profitable services.",
    },
    {
      icon: Users,
      title: "Staff Role Management",
      description: "Define roles (Front Desk, Housekeeping, Kitchen) and custom access for each staff member.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">All Tools for Modern Hotel Management</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            One system that fully answers the needs of your hotel, staff, and guests.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

