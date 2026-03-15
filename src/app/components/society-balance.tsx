import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, DollarSign, Edit } from "lucide-react";
import { getSocietyBalanceAPI, updateSocietyBalanceAPI } from "@/app/services/api";
import { toast } from "sonner";

export function SocietyBalance() {
  const [isLoading, setIsLoading] = useState(true);
  const [balanceData, setBalanceData] = useState<{
    currentBalance: number;
    totalPayments: number;
    totalExpenditure: number;
    lastUpdated: string;
  } | null>(null);

  const loadBalance = async () => {
    try {
      setIsLoading(true);
      // ApiCall: GET /api/society/balance
      const data = await getSocietyBalanceAPI();
      setBalanceData(data);
    } catch (error) {
      console.error('Failed to load society balance:', error);
      toast.error('Failed to load society balance');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading balance...</p>
        </div>
      </div>
    );
  }

  if (!balanceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Failed to load balance data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl md:text-3xl mb-0 text-slate-800 font-bold">Society Balance</h1>
            </div>
            <p className="text-slate-600">Financial overview and current balance</p>
          </div>
          <EditBalanceDialog onSuccess={loadBalance} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-emerald-800">Current Balance</CardTitle>
                <Wallet className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-emerald-700 mb-1">₹{balanceData.currentBalance.toLocaleString()}</p>
              <p className="text-xs text-emerald-600">Available funds</p>
            </CardContent>
          </Card>

          <Card className="border-green-100 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-green-800">Total Income</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-green-700 mb-1">₹{balanceData.totalPayments.toLocaleString()}</p>
              <p className="text-xs text-green-600">Maintenance collected</p>
            </CardContent>
          </Card>

          <Card className="border-red-100 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-red-800">Total Expenditure</CardTitle>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-red-700 mb-1">₹{balanceData.totalExpenditure.toLocaleString()}</p>
              <p className="text-xs text-red-600">Society expenses</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-emerald-800">Balance Summary</CardTitle>
            <CardDescription>Financial statement breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-800 mb-1">Total Income (Maintenance)</p>
                    <p className="text-xs text-green-600">All payments received</p>
                  </div>
                </div>
                <p className="text-xl text-green-700">+ ₹{balanceData.totalPayments.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-red-800 mb-1">Total Expenditure</p>
                    <p className="text-xs text-red-600">All society expenses</p>
                  </div>
                </div>
                <p className="text-xl text-red-700">- ₹{balanceData.totalExpenditure.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border-2 border-emerald-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-800 mb-1">Net Balance</p>
                    <p className="text-xs text-emerald-600">Available funds in society account</p>
                  </div>
                </div>
                <p className="text-2xl text-emerald-700">₹{balanceData.currentBalance.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Last Updated:</strong> {new Date(balanceData.lastUpdated).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3">
          <Link to="/expenditures" className="flex-1">
            <Button variant="outline" className="w-full border-red-200 hover:bg-red-50">
              <TrendingDown className="h-4 w-4 mr-2" />
              View Expenditures
            </Button>
          </Link>
          <Link to="/reports" className="flex-1">
            <Button variant="outline" className="w-full border-emerald-200 hover:bg-emerald-50">
              <DollarSign className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function EditBalanceDialog({ onSuccess }: { onSuccess: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialBalance, setInitialBalance] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialBalance) {
      toast.error("Please enter an initial balance");
      return;
    }

    try {
      setIsLoading(true);
      // ApiCall: PUT /api/society/balance
      await updateSocietyBalanceAPI(parseFloat(initialBalance));
      toast.success("Initial balance updated successfully");
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to update initial balance:', error);
      toast.error("Failed to update initial balance");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Edit className="h-4 w-4 mr-2" />
          Edit Initial Balance
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Initial Society Balance</DialogTitle>
          <DialogDescription>
            Update the initial balance for society funds. This will recalculate the current balance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initialBalance">Initial Balance (₹) *</Label>
            <Input
              id="initialBalance"
              type="number"
              min="0"
              step="100"
              placeholder="0"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              required
              className="border-emerald-200"
            />
            <p className="text-xs text-slate-500">
              Enter the initial opening balance for the society account
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Balance"}
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
