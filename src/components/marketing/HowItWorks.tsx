import { ScanLine, MessageSquare, BarChart3 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: ScanLine,
      title: "Guests Scan",
      description: "Guests scan the QR code in their room to access services instantly. No app download required.",
    },
    {
      icon: MessageSquare,
      title: "Staff Responds",
      description: "Requests appear immediately on the staff dashboard. Assign tasks and track progress in real-time.",
    },
    {
      icon: BarChart3,
      title: "Managers Analyze",
      description: "Get insights on response times, popular services, and staff performance to optimize operations.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple setup, powerful results. Get started in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-6 relative z-10">
                <step.icon className="h-10 w-10 text-primary" />
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold border-2 border-white">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

