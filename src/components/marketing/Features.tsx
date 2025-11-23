import { QrCode, Smartphone, LayoutDashboard, Globe, ShieldCheck, Zap } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Smartphone,
      title: "Guest Mobile Web App",
      description: "No downloads. Works on any smartphone. Beautiful, responsive interface for ordering services.",
    },
    {
      icon: LayoutDashboard,
      title: "Staff Dashboard",
      description: "Centralized command center. Real-time updates, task management, and notifications.",
    },
    {
      icon: Globe,
      title: "Multi-Language Engine",
      description: "Automatically translate services and menus into your guests' native languages.",
    },
    {
      icon: QrCode,
      title: "Smart QR Management",
      description: "Generate unique QR codes for each room. Track usage and update links dynamically.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      description: "Enterprise-grade security. Data encryption and reliable uptime for peace of mind.",
    },
    {
      icon: Zap,
      title: "Real-Time Analytics",
      description: "Make data-driven decisions. Track response times, popular items, and peak hours.",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A complete suite of tools to modernize your hotel operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-6 text-primary">
                <feature.icon className="h-6 w-6" />
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

