import Link from "next/link";
import { CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function RequestStatusPage({
  params,
}: {
  params: Promise<{ hotelSlug: string; roomCode: string; requestId: string }>;
}) {
  const { hotelSlug, roomCode, requestId } = await params;

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50 p-6 flex items-center justify-center text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="text-2xl font-bold font-heading text-gray-900 mb-2">Request Received!</h1>
      <p className="text-gray-500 mb-8 max-w-xs mx-auto">
        Your request for <span className="font-semibold text-gray-900">Club Sandwich</span> has been sent to the staff.
      </p>

      <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">Status</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
            In Progress
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Estimated Time</span>
          <div className="flex items-center gap-1.5 text-gray-900 font-medium">
            <Clock className="h-4 w-4 text-gray-400" />
            20 min
          </div>
        </div>
      </div>

      <Link href={`/g/${hotelSlug}/${roomCode}`}>
        <Button variant="outline" className="gap-2">
          Back to Home <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

