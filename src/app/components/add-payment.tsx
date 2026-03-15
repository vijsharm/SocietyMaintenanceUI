import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { ArrowLeft, Check } from "lucide-react";
import { getMembersAPI, createPaymentAPI } from "@/app/services/api";
import { Member } from "@/app/types";
import { toast } from "sonner";
import { MonthYearPicker } from "@/app/components/ui/month-year-picker";

export function AddPayment() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [formData, setFormData] = useState({
    memberId: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7),
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMode: "",
    transactionId: "",
    paymentType: "maintenance" as "maintenance" | "electricity",
  });

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoadingMembers(true);
        // ApiCall: GET /api/members
        const membersData = await getMembersAPI();
        setMembers(membersData);
      } catch (error) {
        console.error('Failed to load members:', error);
        toast.error('Failed to load members');
      } finally {
        setIsLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.memberId || !formData.amount || !formData.paymentMode) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.paymentType === "maintenance" && !formData.month) {
      toast.error("Please select a month for maintenance payment");
      return;
    }

    try {
      setIsLoading(true);
      // ApiCall: POST /api/payments
      await createPaymentAPI({
        memberId: formData.memberId,
        amount: parseFloat(formData.amount),
        month: formData.paymentType === "maintenance" ? formData.month : undefined,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        transactionId: formData.transactionId || undefined,
        paymentType: formData.paymentType,
      });

      toast.success("Payment recorded successfully");
      setTimeout(() => {
        navigate("/members");
      }, 1000);
    } catch (error) {
      console.error('Failed to record payment:', error);
      toast.error("Failed to record payment");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMember = members.find(m => m.id === formData.memberId);

  if (isLoadingMembers) {
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

        <Card className="border-emerald-100 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Record Payment
            </CardTitle>
            <CardDescription>Add a new payment record</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type *</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value: "maintenance" | "electricity") => 
                    setFormData({ ...formData, paymentType: value })
                  }
                >
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberId">Member *</Label>
                <Select
                  value={formData.memberId?.toString()}
                  onValueChange={(value) => {
                    const numericId = Number(value);
                    const member = members.find(m => m.id === value);
                    setFormData({ 
                      ...formData, 
                      memberId: numericId,
                      amount: member?.monthlyAmount.toString() || "",
                    });
                  }}
                >
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
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
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-900">
                    <strong>Member:</strong> {selectedMember.name}
                  </p>
                  <p className="text-sm text-emerald-900">
                    <strong>Flat:</strong> {selectedMember.flatNumber}
                  </p>
                  <p className="text-sm text-emerald-900">
                    <strong>Monthly Amount:</strong> ₹{selectedMember.monthlyAmount.toLocaleString()}
                  </p>
                  {formData.paymentType === "electricity" && selectedMember.electricityArrear && selectedMember.electricityArrear > 0 && (
                    <p className="text-sm text-orange-800 mt-2">
                      <strong>Electricity Arrear:</strong> ₹{selectedMember.electricityArrear.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.paymentType === "maintenance" && (
                  <div className="space-y-2">
                    <Label htmlFor="month">Month *</Label>
                    <MonthYearPicker
                      value={formData.month}
                      onChange={(value) => setFormData({ ...formData, month: value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date *</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    required
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMode">Payment Mode *</Label>
                  <Select
                    value={formData.paymentMode}
                    onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
                  >
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="Optional"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Recording Payment..." : "Record Payment"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
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
