import { ScanLine, MessageSquare, BarChart3 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: ScanLine,
      title: "1. Guest Scans",
      description: "A simple scan of the QR code in the room opens the service menu. No app download or registration required.",
    },
    {
      icon: MessageSquare,
      title: "2. Staff Receives",
      description: "The request appears instantly on the tablet or mobile of the relevant staff member (Reception, Housekeeping, Kitchen).",
    },
    {
      icon: BarChart3,
      title: "3. Manager Analyzes",
      description: "Get business insights in real-time: response times, satisfaction, and upsell opportunities.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple process with quick implementation that upgrades your hotel in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-blue-100 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="h-24 w-24 rounded-full bg-white border-4 border-blue-50 shadow-lg flex items-center justify-center mb-8 relative z-10 group-hover:border-blue-100 group-hover:scale-110 transition-all duration-300">
                <step.icon className="h-10 w-10 text-primary" />
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold border-2 border-white shadow-md">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed px-4">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

