import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Shield, Zap, Globe, Heart, Target, Users, TrendingUp, Code, Lightbulb, Award, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-slate-900 mb-6">
              About HotelX
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We&apos;re on a mission to revolutionize hospitality technology, making it simple, 
              accessible, and powerful for hotels of all sizes.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
                Our Story
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
              <p className="text-lg leading-relaxed">
                HotelX was born from a simple observation during a stay at a boutique hotel in Europe: 
                guests want instant, seamless service, but hotel staff are overwhelmed with phone calls, 
                paper notes, and manual coordination. There had to be a better way.
              </p>
              <p className="leading-relaxed">
                Our founders, experienced in both hospitality and technology, recognized that the industry 
                was ready for a digital transformation. While guests expect the convenience of modern apps 
                in their daily lives, hotels were still relying on outdated methods. We set out to bridge 
                this gap with a solution that requires no app downloads, no complex training, and no 
                expensive hardware—just a simple enough and a smartphone.
              </p>
              <p className="leading-relaxed">
                Today, HotelX serves hotels across Europe and beyond, helping them reduce response times 
                by up to 40%, increase service revenue by 30%, and create happier guests through seamless 
                digital experiences. We&apos;ve built a platform that works for everyone: from small 
                family-run inns to large hotel chains.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem We Solve */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
                The Problem We Solve
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Slow Response Times</h3>
                <p className="text-slate-600 leading-relaxed">
                  Guests wait on hold or leave messages, leading to frustration and missed opportunities. 
                  Staff struggle to prioritize and track requests efficiently.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Language Barriers</h3>
                <p className="text-slate-600 leading-relaxed">
                  International guests struggle to communicate needs, while staff may not speak multiple 
                  languages. Miscommunication leads to service failures.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-yellow-50 flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Missed Revenue</h3>
                <p className="text-slate-600 leading-relaxed">
                  Without easy ordering systems, guests order less. Hotels miss opportunities to upsell 
                  services, spa treatments, and dining options.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center mb-6">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Outdated Technology</h3>
                <p className="text-slate-600 leading-relaxed">
                  Many hotels rely on legacy systems that are expensive, difficult to use, and don&apos;t 
                  integrate with modern guest expectations or mobile devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
                Our Values
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                These principles guide everything we do, from product development to customer support.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <Shield className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Security First</h3>
                <p className="text-slate-600 leading-relaxed">
                  Enterprise-grade security with end-to-end encryption, GDPR compliance, and regular 
                  security audits. Your data and your guests&apos; privacy are our top priority.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <Zap className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Simplicity</h3>
                <p className="text-slate-600 leading-relaxed">
                  We believe technology should be intuitive. No complex training, no technical expertise 
                  required. If you can use a smartphone, you can use HotelX.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <Globe className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Global Accessibility</h3>
                <p className="text-slate-600 leading-relaxed">
                  Multi-language support for 15+ languages, automatic translation, and support for 
                  international guests. We break down language barriers.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
                <Heart className="h-10 w-10 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Guest-Centric</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every feature is designed with guest satisfaction in mind. We measure success by 
                  the smiles on guests&apos; faces and the ease of staff operations.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
                <Target className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Results-Driven</h3>
                <p className="text-slate-600 leading-relaxed">
                  We don&apos;t just build features—we build solutions that deliver measurable results: 
                  faster response times, increased revenue, and improved guest satisfaction.
                </p>
              </div>
              
              <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100">
                <Lightbulb className="h-10 w-10 text-teal-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation</h3>
                <p className="text-slate-600 leading-relaxed">
                  We continuously innovate, listening to hotel owners and guests to build features that 
                  truly matter. Our roadmap is shaped by real-world needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Our Impact
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Numbers that tell the story of transformation
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2">40%</div>
                <div className="text-slate-300">Average reduction in response times</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-400 mb-2">30%</div>
                <div className="text-slate-300">Increase in service revenue</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400 mb-2">15+</div>
                <div className="text-slate-300">Languages supported</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-start gap-4">
                <Award className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-3">Trusted by Hotels Across Europe</h3>
                  <p className="text-slate-300 leading-relaxed">
                    From boutique hotels in Paris to beach resorts in Greece, HotelX is helping hotels 
                    modernize their operations and delight their guests. Our platform handles thousands 
                    of requests daily, proving that simplicity and power can coexist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">
                How We Work
              </h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Listen First</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We start by understanding your hotel&apos;s unique needs, challenges, and goals. 
                    Every hotel is different, and we tailor our approach accordingly.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Setup</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Get started in minutes, not weeks. Our platform is designed for rapid deployment, 
                    and our team provides hands-on support to ensure smooth onboarding.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Continuous Support</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We&apos;re here for you every step of the way. From initial training to ongoing 
                    optimization, our support team ensures you get the most out of HotelX.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Evolve Together</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Your feedback shapes our product. We regularly release new features based on 
                    customer needs, ensuring HotelX stays ahead of the curve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Join Us on This Journey
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you&apos;re a small boutique hotel or a large chain, HotelX can help you 
              transform your guest experience and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 text-lg font-semibold shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 h-14 px-8 text-lg font-semibold">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

