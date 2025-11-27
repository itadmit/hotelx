import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
              <p className="leading-relaxed">
                HotelX (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                use our hotel management platform and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Hotel Information</h3>
              <p className="leading-relaxed mb-4">
                When you register as a hotel, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Hotel name, address, and contact information</li>
                <li>Number of rooms and hotel configuration</li>
                <li>Payment and billing information</li>
                <li>Account credentials and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Guest Information</h3>
              <p className="leading-relaxed mb-4">
                When guests use our platform, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Name, phone number, and email address (optional)</li>
                <li>Room number and service requests</li>
                <li>Order history and preferences</li>
                <li>Feedback and reviews</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Technical Information</h3>
              <p className="leading-relaxed mb-4">
                We automatically collect certain technical information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Usage patterns and interaction data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
              <p className="leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To process service requests and manage hotel operations</li>
                <li>To communicate with you about your account and our services</li>
                <li>To improve and optimize our platform</li>
                <li>To analyze usage patterns and generate reports</li>
                <li>To ensure security and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sharing and Disclosure</h2>
              <p className="leading-relaxed mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>With your hotel:</strong> Guest information is shared with the hotel where you are staying to facilitate service delivery</li>
                <li><strong>Service providers:</strong> We may share data with trusted third-party service providers who assist in operating our platform</li>
                <li><strong>Legal requirements:</strong> We may disclose information if required by law or to protect our rights</li>
                <li><strong>Business transfers:</strong> In the event of a merger or acquisition, your information may be transferred</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
              <p className="leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption, 
                secure servers, and regular security audits. However, no method of transmission over the internet 
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
              <p className="leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies and Tracking</h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage, and 
                improve our services. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention</h2>
              <p className="leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and comply 
                with legal obligations. Guest data is typically retained for the duration of their stay plus a 
                reasonable period for operational purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Children&apos;s Privacy</h2>
              <p className="leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a child, 
                please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">International Data Transfers</h2>
              <p className="leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure 
                appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised 
                to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-2">HotelX</p>
                <p className="text-slate-700 mb-2">
                  Email: <a href="mailto:info@hotelx.app" className="text-blue-600 hover:underline">info@hotelx.app</a>
                </p>
                <p className="text-slate-700">
                  Website: <a href="https://hotelx.app" className="text-blue-600 hover:underline">https://hotelx.app</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

