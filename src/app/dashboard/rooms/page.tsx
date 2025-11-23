"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, QrCode, Download, Upload, MoreHorizontal, Filter, SlidersHorizontal } from "lucide-react";

export default function RoomsPage() {
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedQrRoom, setSelectedQrRoom] = useState<string | null>(null);

  const rooms = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    number: `${100 + i}`,
    type: i % 3 === 0 ? "Suite" : i % 2 === 0 ? "Double" : "Single",
    status: i === 2 ? "Maintenance" : "Active",
    lastScan: "2 hours ago",
    guests: i % 3 === 0 ? "Vacant" : "Occupied"
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Rooms Management</h1>
          <p className="text-gray-500 mt-1">Overview of all rooms, status, and occupancy</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 gap-2 rounded-xl"
            onClick={() => setIsImportOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button 
            onClick={() => setIsAddRoomOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200"
          >
            <Plus className="h-4 w-4" />
            Add Room
          </Button>
        </div>
      </div>

      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>Add a room to your hotel inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid gap-2">
                <Label>Room Number</Label>
                <Input placeholder="e.g. 405" />
             </div>
             <div className="grid gap-2">
                <Label>Room Type</Label>
                <Select>
                   <option>Single</option>
                   <option>Double</option>
                   <option>Suite</option>
                   <option>Deluxe</option>
                </Select>
             </div>
             <div className="grid gap-2">
                <Label>Floor</Label>
                <Select>
                   <option>1st Floor</option>
                   <option>2nd Floor</option>
                   <option>3rd Floor</option>
                   <option>4th Floor</option>
                </Select>
             </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>Cancel</Button>
             <Button onClick={() => setIsAddRoomOpen(false)}>Add Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Rooms</DialogTitle>
            <DialogDescription>Upload a CSV file to bulk import rooms.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
             <Upload className="h-8 w-8 text-gray-400 mb-2" />
             <p className="text-sm font-medium text-gray-600">Click to upload CSV</p>
             <p className="text-xs text-gray-400 mt-1">Max file size: 5MB</p>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
             <Button onClick={() => setIsImportOpen(false)}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedQrRoom} onOpenChange={(open) => !open && setSelectedQrRoom(null)}>
         <DialogContent className="sm:max-w-sm">
            <DialogHeader>
               <DialogTitle>Room {selectedQrRoom} QR Code</DialogTitle>
               <DialogDescription>Scan to test or download for print.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-6">
               <div className="bg-white p-4 rounded-xl shadow-inner border">
                  <QrCode className="h-48 w-48 text-gray-900" />
               </div>
            </div>
            <DialogFooter className="sm:justify-center">
               <Button variant="outline" className="w-full" onClick={() => setSelectedQrRoom(null)}>
                  <Download className="mr-2 h-4 w-4" /> Download PNG
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-sm border-none overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
           <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                 placeholder="Search room number..." 
                 className="pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 rounded-xl" 
              />
           </div>
           <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none border-gray-200 rounded-xl gap-2 text-gray-600">
                 <Filter className="h-4 w-4" />
                 Status
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none border-gray-200 rounded-xl gap-2 text-gray-600">
                 <SlidersHorizontal className="h-4 w-4" />
                 Type
              </Button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-semibold">Room Number</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Occupancy</th>
                <th className="px-6 py-4 font-semibold">QR Code</th>
                <th className="px-6 py-4 font-semibold">Last Activity</th>
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="font-bold text-gray-900 text-base">{room.number}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                       {room.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     {room.status === 'Active' ? (
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-green-500"></div>
                           <span className="text-sm font-medium text-green-700">Active</span>
                        </div>
                     ) : (
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-red-500"></div>
                           <span className="text-sm font-medium text-red-700">Maintenance</span>
                        </div>
                     )}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`text-sm font-medium ${room.guests === 'Occupied' ? 'text-indigo-600' : 'text-gray-400'}`}>
                        {room.guests}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg font-medium"
                      onClick={() => setSelectedQrRoom(room.number)}
                    >
                      <QrCode className="h-4 w-4" /> View
                    </Button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{room.lastScan}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-lg">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination / Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-center">
           <Button variant="ghost" className="text-sm text-gray-500 hover:bg-gray-50 rounded-xl">Load More Rooms</Button>
        </div>
      </div>
    </div>
  );
}