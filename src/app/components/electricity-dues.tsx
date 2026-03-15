import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { ArrowLeft, Zap } from "lucide-react";
import { getMembersAPI, updateMemberAPI } from "@/app/services/api";
import { Member } from "@/app/types";
import { toast } from "sonner";

export function ElectricityDues() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    electricityArrear: "",
  });

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoading(true);
        // ApiCall: GET /api/members
        const membersData = await getMembersAPI();
        setMembers(membersData);
      } catch (error) {
        console.error('Failed to load members:', error);
        toast.error('Failed to load members');
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.memberId || !formData.electricityArrear) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);
      const member = members.find(m => m.id === formData.memberId);
      if (!member) {
        toast.error("Member not found");
        return;
      }

      // ApiCall: PUT /api/members/:id
      await updateMemberAPI(formData.memberId, {
        ...member,
        electricityArrear: parseFloat(formData.electricityArrear),
      });

      toast.success("Electricity arrear updated successfully");
      setTimeout(() => {
        navigate("/members");
      }, 1000);
    } catch (error) {
      console.error('Failed to update electricity arrear:', error);
      toast.error("Failed to update electricity arrear");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedMember = members.find(m => m.id === formData.memberId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="border-yellow-100 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Update Electricity Arrear
            </CardTitle>
            <CardDescription>Set or update electricity dues for a member</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="memberId">Select Member *</Label>
                <Select
                  value={formData.memberId?.toString()}
                  onValueChange={(value) => {
                    const numericId = Number(value);
                    const member = members.find(m => m.id === value);
                    setFormData({ 
                      memberId: numericId,
                      electricityArrear: member?.electricityArrear?.toString() || "0",
                    });
                  }}
                >
                  <SelectTrigger className="border-yellow-200 focus:border-yellow-400">
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.flatNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedMember && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-900 mb-2">
                    <strong>Member:</strong> {selectedMember.name}
                  </p>
                  <p className="text-sm text-yellow-900 mb-2">
                    <strong>Flat:</strong> {selectedMember.flatNumber}
                  </p>
                  <p className="text-sm text-yellow-900">
                    <strong>Current Arrear:</strong> ₹{(selectedMember.electricityArrear || 0).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="electricityArrear">Electricity Arrear Amount (₹) *</Label>
                <Input
                  id="electricityArrear"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={formData.electricityArrear}
                  onChange={(e) => setFormData({ ...formData, electricityArrear: e.target.value })}
                  required
                  className="border-yellow-200 focus:border-yellow-400"
                />
                <p className="text-xs text-slate-500">
                  This is a one-time electricity dues amount. Set to 0 to clear existing arrear.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  disabled={isSaving}
                >
                  {isSaving ? "Updating..." : "Update Arrear"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="border-slate-200"
                  disabled={isSaving}
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
