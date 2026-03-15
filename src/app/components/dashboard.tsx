import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Users, IndianRupee, FileText, PlusCircle, UserPlus, AlertTriangle, LogOut, Wallet, Zap, TrendingDown } from "lucide-react";
import { Header } from "@/app/components/header";
import { useAuth } from "@/app/context/auth-context";
import { useNavigate } from "react-router";
import { Badge } from "@/app/components/ui/badge";
import { getDashboardStatsAPI, getPaymentsAPI, getMembersAPI } from "@/app/services/api";
import { Payment, Member } from "@/app/types";
import { formatMonth, getCurrentMonth } from "@/app/utils/dues-calculator";
import { toast } from "sonner";

export function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalMembers: number;
    collectedThisMonth: number;
    expectedThisMonth: number;
    pendingThisMonth: number;
    paymentsThisMonth: number;
    societyBalance: number;
    totalExpenditure: number;
    totalPendingAllMonths: number;
  } | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // ApiCall: GET /api/statistics/dashboard
        const dashboardStats = await getDashboardStatsAPI();
        setStats(dashboardStats);
        
        // ApiCall: GET /api/payments (recent payments)
        const payments = await getPaymentsAPI();
        setRecentPayments(payments.slice(0, 5));
        
        // ApiCall: GET /api/members (for payment details)
        const membersData = await getMembersAPI();
        setMembers(membersData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const currentMonth = getCurrentMonth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* User Info Bar */}
        <div className="flex items-center justify-between mb-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-slate-800">{user?.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant={isAdmin() ? "default" : "secondary"} className={isAdmin() ? "bg-emerald-600" : ""}>
                  {isAdmin() ? "Admin" : "Read Only"}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-200 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <Header 
          title="Dashboard" 
          subtitle="Manage maintenance payments and member records"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardTitle className="text-sm text-slate-700">Society Balance</CardTitle>
              <Wallet className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl text-emerald-700">₹{stats.societyBalance.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">
                <Link to="/society-balance" className="text-emerald-600 hover:underline">View details</Link>
              </p>
            </CardContent>
          </Card>

          <Card className="border-teal-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-teal-50 to-cyan-50">
              <CardTitle className="text-sm text-slate-700">Total Members</CardTitle>
              <Users className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl text-teal-700">{stats.totalMembers}</div>
              <p className="text-xs text-slate-500 mt-1">Active residents</p>
            </CardContent>
          </Card>

          <Card className="border-cyan-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-cyan-50 to-blue-50">
              <CardTitle className="text-sm text-slate-700">Collected ({formatMonth(currentMonth)})</CardTitle>
              <IndianRupee className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl text-cyan-700">₹{stats.collectedThisMonth.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">{stats.paymentsThisMonth} payments received</p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-orange-50 to-amber-50">
              <CardTitle className="text-sm text-slate-700">Pending ({formatMonth(currentMonth)})</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl text-orange-700">₹{stats.pendingThisMonth.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.totalMembers - stats.paymentsThisMonth} members pending
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-red-50 to-pink-50">
              <CardTitle className="text-sm text-slate-700">Expenditure</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl text-red-700">₹{stats.totalExpenditure.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">
                <Link to="/expenditures" className="text-red-600 hover:underline">View details</Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-emerald-100 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-emerald-800">Quick Actions</CardTitle>
            <CardDescription>Manage your society maintenance</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {isAdmin() && (
                <>
                  <Link to="/add-payment">
                    <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" size="lg">
                      <PlusCircle className="h-6 w-6" />
                      Add Payment
                    </Button>
                  </Link>
                  
                  <Link to="/add-member">
                    <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700" size="lg">
                      <UserPlus className="h-6 w-6" />
                      Add Member
                    </Button>
                  </Link>
                  
                  <Link to="/electricity-dues">
                    <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700" size="lg">
                      <Zap className="h-6 w-6" />
                      Electricity Dues
                    </Button>
                  </Link>
                  
                  <Link to="/add-expenditure">
                    <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700" size="lg">
                      <TrendingDown className="h-6 w-6" />
                      Add Expenditure
                    </Button>
                  </Link>
                </>
              )}
              
              <Link to="/members">
                <Button className="w-full h-24 flex flex-col gap-2 border-emerald-200 hover:bg-emerald-50" size="lg" variant="outline">
                  <Users className="h-6 w-6 text-emerald-700" />
                  View Members
                </Button>
              </Link>
              
              <Link to="/dues">
                <Button className="w-full h-24 flex flex-col gap-2 border-orange-200 hover:bg-orange-50" size="lg" variant="outline">
                  <AlertTriangle className="h-6 w-6 text-orange-700" />
                  Pending Dues
                </Button>
              </Link>
              
              <Link to="/expenditures">
                <Button className="w-full h-24 flex flex-col gap-2 border-red-200 hover:bg-red-50" size="lg" variant="outline">
                  <TrendingDown className="h-6 w-6 text-red-700" />
                  Expenditures
                </Button>
              </Link>
              
              <Link to="/reports">
                <Button className="w-full h-24 flex flex-col gap-2 border-teal-200 hover:bg-teal-50" size="lg" variant="outline">
                  <FileText className="h-6 w-6 text-teal-700" />
                  Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="border-emerald-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-emerald-800">Recent Payments</CardTitle>
                <CardDescription>Latest maintenance payments received</CardDescription>
              </div>
              <Link to="/add-payment">
                {isAdmin() && (
                  <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                )}
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Show total pending summary */}
              {stats.totalPendingAllMonths > 0 && (
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-800 mb-1">Total Outstanding Dues</p>
                      <p className="text-xs text-orange-600">All pending payments across all months</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl text-orange-700">₹{stats.totalPendingAllMonths.toLocaleString()}</p>
                      <Link to="/dues">
                        <Button size="sm" variant="link" className="text-orange-600 p-0 h-auto">
                          View Details →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => {
                  const member = members.find(m => m.id === payment.memberId);
                  return (
                    <div key={payment.id} className="flex items-center justify-between border-b border-emerald-100 pb-3 last:border-0">
                      <div>
                        <p className="text-sm text-slate-800">{member?.name || 'Unknown Member'}</p>
                        <p className="text-xs text-slate-500">{member?.flatNumber || 'N/A'} • {payment.paymentMode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-emerald-700">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{new Date(payment.paymentDate).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">No recent payments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
