import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { ArrowLeft, AlertTriangle, Download, Calendar, IndianRupee, Zap, Check } from "lucide-react";
import { getPendingDuesAPI, getMembersAPI, createPaymentAPI } from "@/app/services/api";
import { toast } from "sonner";
import { Badge } from "@/app/components/ui/badge";
import { MonthYearPicker } from "@/app/components/ui/month-year-picker";
import { Member } from "@/app/types";

type ViewType = "all" | "month" | "electricity";

export function DuesManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState<ViewType>("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [pendingDues, setPendingDues] = useState<Array<{
    memberId: string;
    memberName: string;
    flatNumber: string;
    pendingMonths: Array<{
      month: string;
      amount: number;
    }>;
    electricityArrear: number;
    totalPending: number;
  }>>([]);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // ApiCall: GET /api/statistics/pending-dues
        const duesData = await getPendingDuesAPI();
        setPendingDues(duesData);
        
        // ApiCall: GET /api/members
        const membersData = await getMembersAPI();
        setMembers(membersData);
      } catch (error) {
        console.error('Failed to load pending dues:', error);
        toast.error('Failed to load pending dues');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Filter dues based on view type
  const getFilteredDues = () => {
    if (viewType === "electricity") {
      // Show only members with electricity arrears
      return pendingDues
        .filter(member => member.electricityArrear > 0)
        .map(member => ({
          ...member,
          totalPending: member.electricityArrear,
          pendingMonths: []
        }));
    } else if (viewType === "month") {
      // Show only members with pending dues for selected month
      return pendingDues
        .map(member => {
          const monthDue = member.pendingMonths.find(pm => pm.month === selectedMonth);
          if (!monthDue) return null;
          return {
            ...member,
            pendingMonths: [monthDue],
            totalPending: monthDue.amount,
            electricityArrear: 0
          };
        })
        .filter(Boolean) as typeof pendingDues;
    } else {
      // Show all pending dues
      return pendingDues;
    }
  };

  const filteredDues = getFilteredDues();
  const totalDues = filteredDues.reduce((sum, member) => sum + member.totalPending, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading pending dues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl md:text-3xl mb-0 text-slate-800 font-bold">Pending Dues</h1>
          </div>
          <p className="text-slate-600">Track and manage outstanding maintenance payments</p>
        </div>

        {/* Filter Options */}
        <Card className="mb-6 border-emerald-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-emerald-800">View Options</CardTitle>
            <CardDescription>Select how you want to view pending dues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>View Type</Label>
                <Select value={viewType} onValueChange={(value: ViewType) => setViewType(value)}>
                  <SelectTrigger className="border-emerald-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Pending Dues (Maintenance + Electricity)
                    </SelectItem>
                    <SelectItem value="month">
                      Specific Month Maintenance Dues
                    </SelectItem>
                    <SelectItem value="electricity">
                      Electricity Arrears Only
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  {viewType === "all" && "Shows all pending maintenance dues and electricity arrears for all members"}
                  {viewType === "month" && "Shows pending maintenance dues for a specific month only"}
                  {viewType === "electricity" && "Shows only members with pending electricity arrears (one-time dues)"}
                </p>
              </div>

              {viewType === "month" && (
                <div className="space-y-2">
                  <Label>Select Month</Label>
                  <MonthYearPicker
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                  />
                  <p className="text-xs text-slate-500">
                    View pending dues for {formatMonth(selectedMonth)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-orange-100 shadow-lg bg-gradient-to-r from-orange-50 to-amber-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl text-orange-700 mb-2">₹{totalDues.toLocaleString()}</p>
                <p className="text-sm text-orange-600">
                  {filteredDues.length} members with pending payments
                  {viewType === "month" && ` for ${formatMonth(selectedMonth)}`}
                  {viewType === "electricity" && " (Electricity only)"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {filteredDues.length > 0 ? (
            filteredDues.map((member) => (
              <Card key={member.memberId} className="border-orange-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-slate-800 flex items-center gap-2 mb-2">
                        {member.memberName}
                        <Badge variant="destructive">Pending</Badge>
                      </CardTitle>
                      <CardDescription>
                        Flat {member.flatNumber} • ₹{member.totalPending.toLocaleString()} total due
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {member.pendingMonths.length > 0 && viewType !== "electricity" && (
                        <RecordMaintenancePaymentDialog 
                          member={member} 
                          members={members}
                          onSuccess={() => window.location.reload()}
                        />
                      )}
                      {member.electricityArrear > 0 && viewType !== "month" && (
                        <RecordElectricityPaymentDialog 
                          member={member} 
                          members={members}
                          onSuccess={() => window.location.reload()}
                        />
                      )}
                      <Link to={`/statement/${member.memberId}`}>
                        <Button size="sm" variant="outline" className="border-emerald-200 hover:bg-emerald-50">
                          <Download className="h-4 w-4 mr-2" />
                          Statement
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {member.pendingMonths.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Maintenance Dues:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {member.pendingMonths.map((pending) => (
                            <Badge
                              key={pending.month}
                              variant="outline"
                              className="border-orange-300 text-orange-700"
                            >
                              {formatMonth(pending.month)}: ₹{pending.amount.toLocaleString()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {member.electricityArrear > 0 && viewType !== "month" && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <strong>Electricity Arrear:</strong> ₹{member.electricityArrear.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-emerald-100 shadow-lg">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-500">
                  {viewType === "all" && "No pending dues! All payments are up to date."}
                  {viewType === "month" && `No pending maintenance dues for ${formatMonth(selectedMonth)}.`}
                  {viewType === "electricity" && "No pending electricity arrears."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Record Maintenance Payment Dialog
function RecordMaintenancePaymentDialog({ 
  member, 
  members,
  onSuccess 
}: { 
  member: { 
    memberId: string; 
    memberName: string; 
    flatNumber: string; 
    pendingMonths: Array<{ month: string; amount: number }>;
  }; 
  members: Member[];
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    month: member.pendingMonths[0]?.month || new Date().toISOString().slice(0, 7),
    amount: member.pendingMonths[0]?.amount.toString() || "",
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMode: "",
    transactionId: "",
  });

  const selectedMember = members.find(m => m.id === member.memberId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.paymentMode || !formData.month) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      // ApiCall: POST /api/payments
      await createPaymentAPI({
        memberId: member.memberId,
        amount: parseFloat(formData.amount),
        month: formData.month,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        transactionId: formData.transactionId || undefined,
        paymentType: "maintenance",
      });

      toast.success("Maintenance payment recorded successfully");
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to record payment:', error);
      toast.error("Failed to record payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <IndianRupee className="h-4 w-4 mr-1" />
          Pay Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Maintenance Payment</DialogTitle>
          <DialogDescription>Record a maintenance payment for {member.memberName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedMember && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-900">
                <strong>Member:</strong> {selectedMember.name}
              </p>
              <p className="text-sm text-emerald-900">
                <strong>Flat:</strong> {selectedMember.flatNumber}
              </p>
              <p className="text-sm text-emerald-900">
                <strong>Monthly Amount:</strong> ₹{selectedMember.monthlyAmount.toLocaleString()}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="month">Month *</Label>
            <MonthYearPicker
              value={formData.month}
              onChange={(value) => {
                const monthDue = member.pendingMonths.find(pm => pm.month === value);
                setFormData({ 
                  ...formData, 
                  month: value,
                  amount: monthDue?.amount.toString() || selectedMember?.monthlyAmount.toString() || ""
                });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹) *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="100"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="border-emerald-200"
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
              className="border-emerald-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode *</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
            >
              <SelectTrigger className="border-emerald-200">
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

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              placeholder="Optional"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              className="border-emerald-200"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
              disabled={isLoading}
            >
              {isLoading ? "Recording..." : "Record Payment"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Record Electricity Payment Dialog
function RecordElectricityPaymentDialog({ 
  member, 
  members,
  onSuccess 
}: { 
  member: { 
    memberId: string; 
    memberName: string; 
    flatNumber: string; 
    electricityArrear: number;
  }; 
  members: Member[];
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: member.electricityArrear.toString(),
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMode: "",
    transactionId: "",
  });

  const selectedMember = members.find(m => m.id === member.memberId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.paymentMode) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      // ApiCall: POST /api/payments
      await createPaymentAPI({
        memberId: member.memberId,
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        transactionId: formData.transactionId || undefined,
        paymentType: "electricity",
      });

      toast.success("Electricity payment recorded successfully");
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to record payment:', error);
      toast.error("Failed to record payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
          <Zap className="h-4 w-4 mr-1" />
          Pay Electricity
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Electricity Payment</DialogTitle>
          <DialogDescription>Record an electricity arrear payment for {member.memberName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedMember && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-900">
                <strong>Member:</strong> {selectedMember.name}
              </p>
              <p className="text-sm text-yellow-900">
                <strong>Flat:</strong> {selectedMember.flatNumber}
              </p>
              <p className="text-sm text-orange-800 mt-2">
                <strong>Current Arrear:</strong> ₹{member.electricityArrear.toLocaleString()}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹) *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="100"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="border-yellow-200"
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
              className="border-yellow-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode *</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
            >
              <SelectTrigger className="border-yellow-200">
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

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              placeholder="Optional"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              className="border-yellow-200"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Recording..." : "Record Payment"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
