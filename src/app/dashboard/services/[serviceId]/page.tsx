import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default async function ServiceEditorPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  // Mock data - in real app, fetch from DB
  const service = {
    id: serviceId,
    name: "Club Sandwich",
    description: "Triple-decker sandwich with roasted chicken breast",
    price: "18.00",
    category: "Room Service",
    estimatedTime: "20-30 min",
    isActive: true,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/services">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Edit Service</h1>
      </div>

      <form className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input id="name" defaultValue={service.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={service.description}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={service.category}
              >
                <option>Room Service</option>
                <option>Housekeeping</option>
                <option>Spa & Wellness</option>
                <option>Transport</option>
                <option>Maintenance</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input id="price" type="number" step="0.01" defaultValue={service.price} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input id="estimatedTime" defaultValue={service.estimatedTime} />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Badge variant={service.isActive ? "default" : "secondary"}>
                {service.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </form>

      <div className="flex justify-end gap-4">
        <Link href="/dashboard/services">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
}

