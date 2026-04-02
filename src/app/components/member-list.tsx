import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, Search, FileText, UserPlus, Edit, Trash2 } from "lucide-react";
import { getMembersAPI, getPaymentsAPI, updateMemberAPI, deleteMemberAPI } from "@/app/services/api";
import { Member, Payment } from "@/app/types";
import { toast } from "sonner";
import { getCurrentMonth } from "@/app/utils/dues-calculator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { useAuth } from "@/app/context/auth-context";

export function MemberList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentMonth = getCurrentMonth();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // ApiCall: GET /api/members
        const membersData = await getMembersAPI();
        setMembers(membersData);
        
        // ApiCall: GET /api/payments
        const paymentsData = await getPaymentsAPI();
        setPayments(paymentsData);
      } catch (error) {
        console.error('Failed to load members:', error);
        toast.error('Failed to load members');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDeleteMember = async (memberId: string) => {
    if (!isAdmin()) {
      toast.error('Only admins can delete members');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this member? This action cannot be undone.');
    if (!confirmDelete) {
      return;
    }

    try {
      // ApiCall: DELETE /api/members/:id
      await deleteMemberAPI(memberId);
      toast.success('Member deleted successfully');

      // Refresh the member list
      const membersData = await getMembersAPI();
      setMembers(membersData);
    } catch (error) {
      console.error('Failed to delete member:', error);
      toast.error('Failed to delete member');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.flatNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMemberPaymentStatus = (memberId: string) => {
    const payment = payments.find(p => p.memberId === memberId && p.month === currentMonth);
    return payment ? "paid" : "pending";
  };

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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4 hover:bg-white/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2 text-slate-800 font-bold">Members</h1>
              <p className="text-slate-600">Nalanda Town - View and manage society members</p>
            </div>
            <Link to="/add-member">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mb-6 border-emerald-100 shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or flat number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
              const paymentStatus = getMemberPaymentStatus(member.id);
              return (
                <Card key={member.id} className="border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg text-slate-800 mb-0">{member.name}</h3>
                          <Badge 
                            variant={paymentStatus === "paid" ? "default" : "destructive"}
                            className={paymentStatus === "paid" ? "bg-emerald-600" : ""}
                          >
                            {paymentStatus === "paid" ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <p className="text-slate-600">
                            <span className="text-slate-500">Flat:</span> {member.flatNumber}
                          </p>
                          <p className="text-slate-600">
                            <span className="text-slate-500">Type:</span> {member.houseType || 'N/A'}
                          </p>
                          <p className="text-slate-600">
                            <span className="text-slate-500">Monthly:</span> ₹{member.monthlyAmount.toLocaleString()}
                          </p>
                          <p className="text-slate-600">
                            <span className="text-slate-500">Phone:</span> {member.phone || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/statement/${member.id}`}>
                          <Button size="sm" variant="outline" className="border-emerald-200 hover:bg-emerald-50">
                            <FileText className="h-4 w-4 mr-2" />
                            Statement
                          </Button>
                        </Link>
                        {isAdmin() && (
                          <>
                            <Link to={`/edit-member/${member.id}`}>
                              <Button size="sm" variant="outline" className="border-emerald-200 hover:bg-emerald-50">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="border-emerald-100 shadow-lg">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-500">No members found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
