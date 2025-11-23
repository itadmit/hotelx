"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Utensils, 
  Sparkles, 
  Car, 
  Filter,
  Clock,
  DollarSign,
  ChefHat
} from "lucide-react";

export default function ServicesPage() {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  const services = [
    { id: 1, name: "Club Sandwich", category: "Room Service", price: "$18.00", time: "20-30 min", status: "Active", icon: Utensils, color: "text-orange-500", bg: "bg-orange-50" },
    { id: 2, name: "Extra Towels", category: "Housekeeping", price: "Free", time: "5-10 min", status: "Active", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 3, name: "Airport Transfer", category: "Transport", price: "$50.00", time: "Book Ahead", status: "Active", icon: Car, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: 4, name: "Caesar Salad", category: "Room Service", price: "$15.00", time: "15-20 min", status: "Inactive", icon: Utensils, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Services & Menu</h1>
          <p className="text-gray-500 mt-1">Manage your digital guest directory and menu items</p>
        </div>
        <Button 
          onClick={() => setIsAddServiceOpen(true)}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </Button>
      </div>

      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>Create a new service or menu item for guests.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
               <Label>Service Name</Label>
               <Input placeholder="e.g. Burger & Fries" />
            </div>
            <div className="grid gap-2">
               <Label>Category</Label>
               <Select>
                  <option>Room Service</option>
                  <option>Housekeeping</option>
                  <option>Transport</option>
                  <option>Spa</option>
               </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                  <Label>Price</Label>
                  <Input placeholder="$0.00" />
               </div>
               <div className="grid gap-2">
                  <Label>Est. Time</Label>
                  <Input placeholder="e.g. 20 min" />
               </div>
            </div>
            <div className="grid gap-2">
               <Label>Description</Label>
               <Input placeholder="Short description..." />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>Cancel</Button>
             <Button onClick={() => setIsAddServiceOpen(false)}>Create Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Categories Sidebar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
          <div>
             <h3 className="font-bold text-gray-900 px-4 mb-2">Categories</h3>
             <nav className="space-y-1">
               {["All Services", "Room Service", "Housekeeping", "Spa & Wellness", "Transport", "Maintenance"].map((cat, i) => (
                 <button 
                   key={cat}
                   className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${i === 0 ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                 >
                   <div className="flex items-center justify-between">
                      {cat}
                      {i === 0 && <span className="bg-white text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">24</span>}
                   </div>
                 </button>
               ))}
             </nav>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
             <h3 className="font-bold text-gray-900 px-4 mb-2">Quick Stats</h3>
             <div className="grid grid-cols-2 gap-2 px-2">
                <div className="bg-gray-50 p-3 rounded-2xl">
                   <div className="text-xs text-gray-500 mb-1">Active Items</div>
                   <div className="text-xl font-bold text-gray-900">42</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl">
                   <div className="text-xs text-gray-500 mb-1">Categories</div>
                   <div className="text-xl font-bold text-gray-900">8</div>
                </div>
             </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-2 rounded-2xl shadow-sm flex gap-2">
             <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                 placeholder="Search for services, food, or amenities..." 
                 className="pl-10 border-transparent bg-transparent focus:bg-gray-50 rounded-xl" 
              />
            </div>
            <Button variant="ghost" className="text-gray-500 hover:bg-gray-50 rounded-xl gap-2">
               <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.id} className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-indigo-100 cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                   </Button>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${service.bg} ${service.color}`}>
                    <service.icon className="h-7 w-7" />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                     <p className="text-sm text-gray-500">{service.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{service.price}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{service.time}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge className={`${service.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} border-none rounded-lg px-3`}>
                    {service.status}
                  </Badge>
                  <span className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                     Edit Details <MoreHorizontal className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
            
            {/* Add New Placeholder Card */}
            <button 
              onClick={() => setIsAddServiceOpen(true)}
              className="rounded-3xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600 transition-all h-full min-h-[200px]"
            >
               <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <Plus className="h-6 w-6" />
               </div>
               <span className="font-medium">Create New Service</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}