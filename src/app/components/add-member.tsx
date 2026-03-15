import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ArrowLeft, UserPlus, Calendar } from "lucide-react";
import { createMemberAPI } from "@/app/services/api";
import { toast } from "sonner";

export function AddMember() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    flatNumber: "",
    email: "",
    phone: "",
    monthlyAmount: "5000",
    houseType: "",
    electricityArrear: "0",
    onboardingDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.flatNumber || !formData.monthlyAmount || !formData.onboardingDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      // ApiCall: POST /api/members
      await createMemberAPI({
        name: formData.name,
        flatNumber: formData.flatNumber,
        email: formData.email,
        phone: formData.phone,
        monthlyAmount: parseFloat(formData.monthlyAmount),
        houseType: formData.houseType || undefined,
        electricityArrear: parseFloat(formData.electricityArrear) || 0,
        onboardingDate: formData.onboardingDate
      });

      toast.success("Member added successfully");
      setTimeout(() => {
        navigate("/members");
      }, 1000);
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error("Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/members">
          <Button variant="ghost" size="sm" className="mb-6 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </Link>

        <Card className="border-emerald-100 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Member
            </CardTitle>
            <CardDescription>Add a new resident to Nalanda Town</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flatNumber">Flat Number *</Label>
                  <Input
                    id="flatNumber"
                    placeholder="e.g., A-101"
                    value={formData.flatNumber}
                    onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                    required
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="member@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="houseType">House Type</Label>
                  <Input
                    id="houseType"
                    placeholder="e.g., Duplex, Apartment"
                    value={formData.houseType}
                    onChange={(e) => setFormData({ ...formData, houseType: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyAmount">Monthly Maintenance (₹) *</Label>
                  <Input
                    id="monthlyAmount"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.monthlyAmount}
                    onChange={(e) => setFormData({ ...formData, monthlyAmount: e.target.value })}
                    required
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="electricityArrear">Electricity Arrear (₹)</Label>
                  <Input
                    id="electricityArrear"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.electricityArrear}
                    onChange={(e) => setFormData({ ...formData, electricityArrear: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="onboardingDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Onboarding Date *
                  </Label>
                  <Input
                    id="onboardingDate"
                    type="date"
                    value={formData.onboardingDate}
                    onChange={(e) => setFormData({ ...formData, onboardingDate: e.target.value })}
                    required
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                  <p className="text-xs text-slate-500">
                    Dues will be calculated from this date onwards
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding Member..." : "Add Member"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/members")}
                  className="border-slate-200"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
