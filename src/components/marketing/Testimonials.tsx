import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote: "Since implementing HotelX, our response times have dropped by 40% and guests are much happier. It transformed how we work.",
      author: "David Cohen",
      role: "CEO, Seaside Hotel",
      rating: 5,
    },
    {
      quote: "The system is incredibly simple. The staff learned to use it in minutes, and guests love not having to download an app.",
      author: "Sarah Levy",
      role: "Operations Manager, Boutique Hotels",
      rating: 5,
    },
    {
      quote: "The reports gave us insights we never had before. We know exactly which services are most profitable and when we're busiest.",
      author: "Ron Abrahami",
      role: "Owner, Mountain View Resort",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Join hundreds of hotels already upgrading their service with HotelX
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                  {t.author[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

