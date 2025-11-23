import { Logo } from "@/components/Logo";

export default function LogoDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-12">
      <div className="max-w-6xl mx-auto space-y-16">
        <div>
          <h1 className="text-4xl font-bold mb-8">Logo Variations</h1>
        </div>

        {/* גודל גדול */}
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-500 mb-6">Large Size (Hero)</h2>
          <Logo size="lg" href="#" />
        </div>

        {/* גודל בינוני */}
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-500 mb-6">Medium Size (Default)</h2>
          <Logo size="md" href="#" />
        </div>

        {/* גודל קטן */}
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-500 mb-6">Small Size</h2>
          <Logo size="sm" href="#" />
        </div>

        {/* רקע כהה */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-400 mb-6">Light Variant (Dark Background)</h2>
          <Logo size="lg" variant="light" href="#" />
        </div>

        {/* ריבוי לוגואים */}
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-500 mb-8">All Sizes Together</h2>
          <div className="flex items-end gap-12">
            <Logo size="sm" href="#" />
            <Logo size="md" href="#" />
            <Logo size="lg" href="#" />
          </div>
        </div>

        {/* הדגמת אנימציה */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-12 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">Hover Effect Demo</h2>
          <p className="text-sm text-gray-600 mb-4">עבור עם העכבר על הלוגו לראות את האנימציה</p>
          <Logo size="lg" href="#" />
        </div>

        {/* עם תגית */}
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-500 mb-8">With Tagline</h2>
          <Logo size="lg" showTagline href="#" />
        </div>

        {/* עם אייקון */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-12 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-8">With Icon</h2>
          <Logo size="lg" showIcon href="#" />
        </div>

        {/* גרסה מלאה */}
        <div className="bg-white rounded-2xl p-12 shadow-lg border-2 border-indigo-100">
          <h2 className="text-lg font-semibold text-gray-500 mb-8">Full Version (Icon + Tagline)</h2>
          <Logo size="lg" showIcon showTagline href="#" />
        </div>
      </div>
    </div>
  );
}

