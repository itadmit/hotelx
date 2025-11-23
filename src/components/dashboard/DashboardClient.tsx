"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TimeRangeToggle, type TimeRange } from "@/components/ui/time-range-toggle";
import { 
  ArrowUpRight, 
  Building2, 
  Users, 
  CreditCard, 
  Activity,
  CalendarRange,
  Clock,
  Utensils,
  AlertCircle,
  Sparkles,
  QrCode,
  Settings,
  Zap
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import Link from "next/link";

interface DashboardClientProps {
  stats: {
    revenue: number;
    occupancy: number;
    guests: number;
    requests: number;
  };
  recentRequests: Array<{
    id: string;
    room: string;
    service: string;
    status: string;
    time: string;
    assignee: string;
  }>;
  monthlyRevenue?: number[];
}

export function DashboardClient({ stats, recentRequests, monthlyRevenue = [] }: DashboardClientProps) {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  useEffect(() => {
    const shouldShowWhatsNew = localStorage.getItem("showWhatsNew");
    if (shouldShowWhatsNew === "true") {
      setShowWhatsNew(true);
    }
  }, []);

  const handleCloseWhatsNew = () => {
    setShowWhatsNew(false);
    localStorage.removeItem("showWhatsNew");
  };

  const statsData = [
    { 
      title: "Revenue", 
      value: `$${stats.revenue.toLocaleString()}`, 
      change: null, 
      icon: CreditCard, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50" 
    },
    { 
      title: "Occupancy", 
      value: `${stats.occupancy}%`, 
      change: null, 
      icon: Building2, 
      color: "text-pink-600", 
      bg: "bg-pink-50" 
    },
    { 
      title: "Guests", 
      value: stats.guests.toString(), 
      change: null, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      title: "Requests", 
      value: stats.requests.toString(), 
      change: stats.requests > 0 ? "Active" : null, 
      icon: Activity, 
      color: "text-orange-600", 
      bg: "bg-orange-50" 
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      "NEW": { bg: "bg-indigo-100", text: "text-indigo-800", label: "New" },
      "IN_PROGRESS": { bg: "bg-yellow-100", text: "text-yellow-800", label: "In Progress" },
      "COMPLETED": { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
      "CANCELLED": { bg: "bg-gray-100", text: "text-gray-800", label: "Cancelled" },
    };
    return statusMap[status] || statusMap["NEW"];
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Good Morning! 👋</h1>
          <p className="text-gray-500 mt-1">Here's a quick overview of your hotel's performance today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 gap-2 rounded-xl">
            <CalendarRange className="h-4 w-4" />
            Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Button>
          <Button 
            onClick={() => setIsAddServiceOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200"
          >
            <Utensils className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Add Request Dialog */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Request</DialogTitle>
            <DialogDescription>Add a new service request for a guest.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="room">Room Number</Label>
              <Input id="room" placeholder="e.g. 305" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service">Service Type</Label>
              <Select>
                <option>Room Service</option>
                <option>Housekeeping</option>
                <option>Maintenance</option>
                <option>Transport</option>
              </Select>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="notes">Notes</Label>
               <Input id="notes" placeholder="Additional details..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddServiceOpen(false)}>Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
              {stat.change && (
                <div className="flex items-center mt-1 gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                  {stat.change.includes('+') && <ArrowUpRight className="h-3 w-3" />}
                  {stat.change}
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-12">
        
        {/* Main Column (8 cols) */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Revenue Chart Widget */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                <p className="text-sm text-gray-500">Revenue performance by period</p>
              </div>
              <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
            </div>
            
            {/* Chart Bars */}
            <div className="h-[280px] flex items-end justify-between gap-3 px-2">
              {monthlyRevenue.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">No revenue data available</p>
                    <p className="text-xs">Start creating requests to see revenue trends</p>
                  </div>
                </div>
              ) : (
                monthlyRevenue.map((h, i) => {
                  const now = new Date();
                  const monthIndex = (now.getMonth() - 11 + i + 12) % 12;
                  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  return (
                    <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full bg-gray-100 rounded-xl relative h-[240px] overflow-hidden">
                        <div 
                          className="absolute bottom-0 w-full bg-indigo-500 rounded-xl transition-all duration-500 group-hover:bg-indigo-600" 
                          style={{ height: `${Math.max(h, 5)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-indigo-600 font-medium transition-colors">
                        {monthNames[monthIndex]}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Requests Table Widget */}
          <div className="bg-white rounded-3xl p-8 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Guest Requests</h3>
                <p className="text-sm text-gray-500">Latest service tickets needing attention</p>
              </div>
              <Link href="/dashboard/requests">
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium">
                  See All Requests
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 rounded-l-xl">Guest / Room</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 rounded-r-xl">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentRequests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No requests yet
                      </td>
                    </tr>
                  ) : (
                    recentRequests.map((req) => {
                      const statusBadge = getStatusBadge(req.status);
                      return (
                        <tr key={req.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                                {req.room}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">Room {req.room}</div>
                                <div className="text-xs text-gray-500">{req.assignee}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">{req.service}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 group-hover:text-gray-600">{req.time}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div className="md:col-span-4 space-y-8">
          
          {/* Room Status Widget */}
          <div className="bg-white rounded-3xl p-8 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Housekeeping Status</h3>
            <div className="relative flex items-center justify-center py-6">
               {/* Simple Donut Chart Representation */}
               <div className="relative h-48 w-48 rounded-full border-16 border-green-100 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-16 border-green-500 border-l-transparent border-b-transparent rotate-45"></div>
                  <div className="text-center">
                     <div className="text-3xl font-bold text-gray-900">{stats.occupancy}%</div>
                     <div className="text-xs text-gray-500 uppercase font-bold tracking-wide mt-1">Active</div>
                  </div>
               </div>
            </div>
            
            <div className="space-y-4 mt-6">
               {[
                 { label: "Active Rooms", count: stats.guests, color: "bg-green-500" },
                 { label: "Total Rooms", count: stats.guests + Math.floor(stats.guests * 0.3), color: "bg-blue-500" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                       <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                       <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.count}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Urgent Tasks */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Urgent Tasks</h3>
            <div className="space-y-4">
                {recentRequests.filter(r => r.status === "NEW").slice(0, 3).map((task, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                      <div className="mt-0.5">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-900">Room {task.room} - {task.service}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {task.time}
                        </div>
                      </div>
                  </div>
                ))}
                {recentRequests.filter(r => r.status === "NEW").length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No urgent tasks</p>
                )}
            </div>
          </div>

        </div>
      </div>

      {/* What's New Modal */}
      <Dialog open={showWhatsNew} onOpenChange={setShowWhatsNew}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              Welcome to HotelX! 🎉
            </DialogTitle>
            <DialogDescription className="text-base">
              Your hotel is now set up and ready to go. Here's what you can do next:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="p-3 bg-indigo-100 rounded-xl h-fit">
                <QrCode className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Generate QR Codes</h3>
                <p className="text-sm text-gray-600">
                  Create QR codes for your rooms so guests can easily access services.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="p-3 bg-purple-100 rounded-xl h-fit">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Add Your Rooms</h3>
                <p className="text-sm text-gray-600">
                  Set up your hotel rooms to start receiving guest requests.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="p-3 bg-blue-100 rounded-xl h-fit">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Customize Services</h3>
                <p className="text-sm text-gray-600">
                  Add, edit, or remove services to match your hotel's offerings.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="p-3 bg-green-100 rounded-xl h-fit">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Configure Settings</h3>
                <p className="text-sm text-gray-600">
                  Customize your hotel's branding, colors, and preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleCloseWhatsNew}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              Got it, let's start!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

