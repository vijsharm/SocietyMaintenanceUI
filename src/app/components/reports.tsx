import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, TrendingUp, Users, IndianRupee, Calendar, FileText } from "lucide-react";
import { getReportsDataAPI } from "@/app/services/api";
import { toast } from "sonner";

export function Reports() {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<{
    monthlyCollection: Array<{
      month: string;
      collected: number;
      expected: number;
      pending: number;
    }>;
    memberPaymentStatus: Array<{
      memberId: string;
      memberName: string;
      flatNumber: string;
      paidMonths: number;
      pendingMonths: number;
      totalPaid: number;
      totalPending: number;
    }>;
  } | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        // ApiCall: GET /api/statistics/reports
        const data = await getReportsDataAPI();
        setReportData(data);
      } catch (error) {
        console.error('Failed to load reports:', error);
        toast.error('Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Failed to load report data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  const totalCollected = reportData.monthlyCollection.reduce((sum, m) => sum + m.collected, 0);
  const totalPending = reportData.monthlyCollection.reduce((sum, m) => sum + m.pending, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4 hover:bg-white/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-teal-600" />
            <h1 className="text-2xl md:text-3xl mb-0 text-slate-800 font-bold">Reports</h1>
          </div>
          <p className="text-slate-600">Comprehensive analytics and payment reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-emerald-800">Total Collected</CardTitle>
                <IndianRupee className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-emerald-700">₹{totalCollected.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-orange-800">Total Pending</CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-orange-700">₹{totalPending.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-teal-100 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-teal-800">Total Members</CardTitle>
                <Users className="h-5 w-5 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-teal-700">{reportData.memberPaymentStatus.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-100 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Collection Report
            </CardTitle>
            <CardDescription>Month-wise payment collection summary</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-emerald-100">
                    <th className="text-left py-3 px-4 text-sm text-slate-700">Month</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-700">Expected</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-700">Collected</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-700">Pending</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-700">Collection %</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.monthlyCollection.map((month) => {
                    const collectionRate = month.expected > 0 
                      ? ((month.collected / month.expected) * 100).toFixed(1)
                      : 0;
                    return (
                      <tr key={month.month} className="border-b border-emerald-50 hover:bg-emerald-50/50">
                        <td className="py-3 px-4 text-sm text-slate-800">{formatMonth(month.month)}</td>
                        <td className="py-3 px-4 text-sm text-slate-600 text-right">₹{month.expected.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-emerald-700 text-right">₹{month.collected.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-orange-700 text-right">₹{month.pending.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-teal-700 text-right">{collectionRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="text-teal-800 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Member Payment Status
            </CardTitle>
            <CardDescription>Individual member payment summary</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-teal-100">
                    <th className="text-left py-3 px-4 text-sm text-slate-700">Member</th>
                    <th className="text-left py-3 px-4 text-sm text-slate-700">Flat</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-700">Paid Months</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-700">Pending Months</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-700">Total Paid</th>
                    <th className="text-right py-3 px-4 text-sm text-slate-700">Total Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.memberPaymentStatus.map((member) => (
                    <tr key={member.memberId} className="border-b border-teal-50 hover:bg-teal-50/50">
                      <td className="py-3 px-4 text-sm text-slate-800">{member.memberName}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{member.flatNumber}</td>
                      <td className="py-3 px-4 text-sm text-emerald-700 text-right">{member.paidMonths}</td>
                      <td className="py-3 px-4 text-sm text-orange-700 text-right">{member.pendingMonths}</td>
                      <td className="py-3 px-4 text-sm text-emerald-700 text-right">₹{member.totalPaid.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-orange-700 text-right">₹{member.totalPending.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
