"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Monitor, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: {
    services: number;
  };
};

export default function LiveMonitorPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.hotelId) return;

    async function fetchCategories() {
      try {
        const response = await fetch(`/api/categories?hotelId=${session.user.hotelId}`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [session?.user?.hotelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-3">
            <Monitor className="h-8 w-8 text-indigo-600" />
            Live Monitor
          </h1>
          <p className="text-gray-500 mt-1">
            Select a department to view their live request monitor
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="bg-indigo-600 text-white p-3 rounded-xl">
            <Monitor className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">How it works</h3>
            <p className="text-sm text-gray-600 mb-3">
              Each department can open their dedicated monitor screen on a TV or tablet. 
              The screen shows real-time requests with visual and audio alerts for new orders.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                🟢 New ({"<"}5 min)
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                🟡 Pending (5-15 min)
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                🔴 Urgent ({">"}15 min)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/dashboard/live-monitor/${category.id}`}
            className="group"
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-indigo-200 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category._count.services} services
                  </p>
                </div>
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {/* All Departments Option */}
        <Link href="/dashboard/live-monitor/all" className="group">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-indigo-600 cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  All Departments
                </h3>
                <p className="text-sm text-gray-500">
                  View all requests from every department
                </p>
              </div>
              <div className="bg-indigo-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Monitor className="h-5 w-5" />
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

