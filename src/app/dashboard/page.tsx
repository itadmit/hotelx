"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  ArrowUpRight, 
  Building2, 
  Users, 
  CreditCard, 
  Activity,
  CalendarRange,
  Download,
  AlertCircle,
  Clock,
  Utensils
} from "lucide-react";

export default function DashboardPage() {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Good Morning, Sarah! 👋</h1>
          <p className="text-gray-500 mt-1">Here's a quick overview of your hotel's performance today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 gap-2 rounded-xl">
            <CalendarRange className="h-4 w-4" />
            Today: Oct 24
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
        {[
          { title: "Revenue", value: "$45,231", change: "+20.1%", icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-50" },
          { title: "Occupancy", value: "85%", change: "+4.0%", icon: Building2, color: "text-pink-600", bg: "bg-pink-50" },
          { title: "Guests", value: "573", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Requests", value: "12", change: "Active", icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
              <div className="flex items-center mt-1 gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                {stat.change.includes('+') && <ArrowUpRight className="h-3 w-3" />}
                {stat.change}
              </div>
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
                <p className="text-sm text-gray-500">Monthly revenue performance</p>
              </div>
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                {['Daily', 'Weekly', 'Monthly'].map((t, i) => (
                  <button key={t} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${i === 1 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chart Bars */}
            <div className="h-[280px] flex items-end justify-between gap-3 px-2">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-gray-100 rounded-xl relative h-[240px] overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-indigo-500 rounded-xl transition-all duration-500 group-hover:bg-indigo-600" 
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-indigo-600 font-medium transition-colors">
                    {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Requests Table Widget */}
          <div className="bg-white rounded-3xl p-8 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Guest Requests</h3>
                <p className="text-sm text-gray-500">Latest service tickets needing attention</p>
              </div>
              <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium">
                See All Requests
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4 rounded-l-xl">Guest / Room</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 rounded-r-xl">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { room: "301", guest: "Sarah Connor", service: "Extra Towels", status: "New", priority: "Normal", color: "blue" },
                    { room: "205", guest: "John Smith", service: "Club Sandwich", status: "In Progress", priority: "High", color: "orange" },
                    { room: "102", guest: "Emily Blunt", service: "Taxi Booking", status: "Completed", priority: "Normal", color: "green" },
                    { room: "404", guest: "Mike Ross", service: "AC Repair", status: "New", priority: "High", color: "red" },
                  ].map((req, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                            {req.room}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{req.guest}</div>
                            <div className="text-xs text-gray-500">Deluxe Suite</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{req.service}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          req.priority === "High" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                        }`}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          req.status === "New" ? "bg-indigo-100 text-indigo-800" : 
                          req.status === "In Progress" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-green-100 text-green-800"
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 group-hover:text-gray-600">2m ago</td>
                    </tr>
                  ))}
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
               <div className="relative h-48 w-48 rounded-full border-[16px] border-green-100 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[16px] border-green-500 border-l-transparent border-b-transparent rotate-45"></div>
                  <div className="text-center">
                     <div className="text-3xl font-bold text-gray-900">72%</div>
                     <div className="text-xs text-gray-500 uppercase font-bold tracking-wide mt-1">Clean</div>
                  </div>
               </div>
            </div>
            
            <div className="space-y-4 mt-6">
               {[
                 { label: "Clean Ready", count: 142, color: "bg-green-500" },
                 { label: "Occupied / Dirty", count: 45, color: "bg-yellow-500" },
                 { label: "Out of Service", count: 8, color: "bg-red-500" }
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
                {[
                  { title: "VIP Arrival - Room 405", time: "10:00 AM", type: "Front Desk" },
                  { title: "AC Maintenance - Floor 3", time: "11:30 AM", type: "Maintenance" },
                  { title: "Staff Meeting", time: "2:00 PM", type: "Management" },
                ].map((task, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                      <div className="mt-0.5">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-900">{task.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {task.time}
                            <span>•</span>
                            {task.type}
                        </div>
                      </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Team Widget */}
          <div className="bg-indigo-900 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 bg-indigo-800 rounded-full opacity-50 blur-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Team on Duty</h3>
              <p className="text-indigo-200 text-sm mb-6">3 departments active</p>
              
              <div className="flex -space-x-4 mb-8">
                 {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-12 w-12 rounded-full border-4 border-indigo-900 bg-white flex items-center justify-center text-indigo-900 font-bold text-xs shadow-sm">
                       ST
                    </div>
                 ))}
                 <div className="h-12 w-12 rounded-full border-4 border-indigo-900 bg-indigo-800 flex items-center justify-center text-white font-bold text-xs">
                    +8
                 </div>
              </div>

              <Button className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl">
                 Manage Schedule
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}