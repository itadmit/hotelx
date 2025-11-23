"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Filter, MoreHorizontal, Clock, Plus, ArrowDownToLine } from "lucide-react";

export default function RequestsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const requests = [
    { id: "REQ-001", room: "305", service: "Extra Towels", status: "New", time: "2m ago", assignee: "Unassigned", priority: "Normal" },
    { id: "REQ-002", room: "204", service: "Room Service", status: "In Progress", time: "15m ago", assignee: "Sarah J.", priority: "High" },
    { id: "REQ-003", room: "112", service: "Taxi", status: "Completed", time: "45m ago", assignee: "Mike T.", priority: "Normal" },
    { id: "REQ-004", room: "401", service: "Maintenance (AC)", status: "New", time: "1h ago", assignee: "Unassigned", priority: "High" },
    { id: "REQ-005", room: "202", service: "Late Checkout", status: "In Progress", time: "1h 20m ago", assignee: "Jessica M.", priority: "Low" },
  ];

  const columns = [
    { title: "New", status: "New", color: "bg-indigo-500", count: 2 },
    { title: "In Progress", status: "In Progress", color: "bg-orange-500", count: 2 },
    { title: "Completed", status: "Completed", color: "bg-green-500", count: 1 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Requests Board</h1>
          <p className="text-gray-500 mt-1">Manage and track guest requests in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 gap-2 rounded-xl">
            <ArrowDownToLine className="h-4 w-4" />
            Export
          </Button>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200"
          >
            <Plus className="h-4 w-4" />
            Create Request
          </Button>
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Request</DialogTitle>
            <DialogDescription>Manually add a new request to the board.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
               <Label htmlFor="room">Room Number</Label>
               <Input id="room" placeholder="101" />
            </div>
            <div className="grid gap-2">
               <Label htmlFor="service">Service</Label>
               <Select>
                  <option>Housekeeping</option>
                  <option>Room Service</option>
                  <option>Maintenance</option>
               </Select>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="priority">Priority</Label>
               <Select>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Low</option>
               </Select>
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
             <Button onClick={() => setIsCreateOpen(false)}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-2 shadow-sm flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by room or service..." 
            className="pl-10 border-transparent bg-transparent focus:bg-gray-50 rounded-xl" 
          />
        </div>
        <div className="flex items-center gap-2 px-2">
          <Button variant="ghost" className="gap-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2">
             <span className="text-sm text-gray-500">View:</span>
             <Button variant="ghost" size="sm" className="text-indigo-600 bg-indigo-50 font-medium rounded-lg">Board</Button>
             <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-50 rounded-lg">List</Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid md:grid-cols-3 gap-6 h-full items-start">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${col.color}`}></div>
                <h3 className="font-bold text-gray-700">{col.title}</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">{col.count}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {requests.filter(r => r.status === col.status).map((req) => (
                <div 
                  key={req.id} 
                  className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-gray-50 text-gray-700 text-xs font-bold px-2 py-1 rounded-lg">
                      Room {req.room}
                    </div>
                    {req.priority === "High" && (
                      <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
                        High Priority
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-1">{req.service}</h4>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                    <Clock className="h-3 w-3" />
                    <span>{req.time}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      {req.assignee === "Unassigned" ? (
                         <div className="h-6 w-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-gray-400">
                           <span className="sr-only">Unassigned</span>
                           <Plus className="h-3 w-3" />
                         </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 border border-white flex items-center justify-center text-[10px] font-bold">
                          {req.assignee.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs text-gray-500 font-medium">{req.assignee}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}