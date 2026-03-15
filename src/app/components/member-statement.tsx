import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { ArrowLeft, Download, Mail, Phone } from "lucide-react";
import { getMemberStatementAPI } from "@/app/services/api";
import { toast } from "sonner";
import { generatePDF } from "@/app/utils/pdf-generator";

export function MemberStatement() {
  const { memberId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [statementData, setStatementData] = useState<{
    member: {
      id: string;
      name: string;
      flatNumber: string;
      email: string;
      phone: string;
      monthlyAmount: number;
      houseType?: string;
      electricityArrear?: number;
      onboardingDate: string;
    };
    payments: Array<{
      id: string;
      amount: number;
      month?: string;
      paymentDate: string;
      paymentMode: string;
      transactionId?: string;
      paymentType: 'maintenance' | 'electricity';
    }>;
    pendingDues: {
      maintenanceDues: Array<{
        month: string;
        amount: number;
      }>;
      electricityArrear: number;
      totalPending: number;
    };
  } | null>(null);

  useEffect(() => {
    if (!memberId) return;

    const loadStatement = async () => {
      try {
        setIsLoading(true);
        // ApiCall: GET /api/statements/:memberId
        const data = await getMemberStatementAPI(memberId);
        setStatementData(data);
      } catch (error) {
        console.error('Failed to load member statement:', error);
        toast.error('Failed to load member statement');
      } finally {
        setIsLoading(false);
      }
    };

    loadStatement();
  }, [memberId]);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleDownload = async () => {
    if (!statementData) return;

    try {
      setIsDownloading(true);
      // Generate PDF using statement data
      await generatePDF(statementData);
      toast.success("Statement downloaded successfully");
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading statement...</p>
        </div>
      </div>
    );
  }

  if (!statementData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">Member not found</p>
              <Link to="/members">
                <Button className="mt-4">Back to Members</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { member, payments, pendingDues } = statementData;
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/members">
          <Button variant="ghost" size="sm" className="mb-6 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </Link>

        <Card className="border-emerald-100 shadow-xl mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl mb-2 text-slate-800">{member.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                      {member.flatNumber}
                    </Badge>
                    {member.houseType && (
                      <span className="text-slate-500">{member.houseType}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {member.phone}
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Generating..." : "Download Statement"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-800 mb-1">Monthly Amount</p>
                <p className="text-2xl text-emerald-700">₹{member.monthlyAmount.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 mb-1">Total Paid</p>
                <p className="text-2xl text-green-700">₹{totalPaid.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800 mb-1">Total Pending</p>
                <p className="text-2xl text-orange-700">₹{pendingDues.totalPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {pendingDues.maintenanceDues.length > 0 && (
          <Card className="border-orange-100 shadow-lg mb-6 bg-orange-50/50">
            <CardContent className="pt-6">
              <h3 className="text-lg text-orange-800 mb-4">Pending Maintenance Dues</h3>
              <div className="flex flex-wrap gap-2">
                {pendingDues.maintenanceDues.map((due) => (
                  <Badge
                    key={due.month}
                    variant="outline"
                    className="border-orange-300 text-orange-700 text-sm py-2 px-3"
                  >
                    {formatMonth(due.month)}: ₹{due.amount.toLocaleString()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {pendingDues.electricityArrear > 0 && (
          <Card className="border-yellow-100 shadow-lg mb-6 bg-yellow-50/50">
            <CardContent className="pt-6">
              <h3 className="text-lg text-yellow-800 mb-2">Electricity Arrear</h3>
              <p className="text-2xl text-yellow-700">₹{pendingDues.electricityArrear.toLocaleString()}</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-emerald-100 shadow-lg">
          <CardContent className="pt-6">
            <h3 className="text-lg text-slate-800 mb-4">Payment History</h3>
            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.paymentDate).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={payment.paymentType === 'maintenance' ? 'default' : 'secondary'}>
                            {payment.paymentType === 'maintenance' ? 'Maintenance' : 'Electricity'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.month ? formatMonth(payment.month) : '-'}
                        </TableCell>
                        <TableCell>{payment.paymentMode}</TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {payment.transactionId || '-'}
                        </TableCell>
                        <TableCell className="text-right text-emerald-700">
                          ₹{payment.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No payment history</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
