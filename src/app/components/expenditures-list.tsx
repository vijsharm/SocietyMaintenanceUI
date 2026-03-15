import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, TrendingDown, Plus, Edit, Trash2 } from "lucide-react";
import { getExpendituresAPI, deleteExpenditureAPI } from "@/app/services/api";
import { toast } from "sonner";
import { Badge } from "@/app/components/ui/badge";
import { useAuth } from "@/app/context/auth-context";

interface Expenditure {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export function ExpendituresList() {
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);

  const loadExpenditures = async () => {
    try {
      setIsLoading(true);
      // ApiCall: GET /api/expenditures
      const expendituresData = await getExpendituresAPI();
      setExpenditures(expendituresData);
    } catch (error) {
      console.error('Failed to load expenditures:', error);
      toast.error('Failed to load expenditures');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenditures();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expenditure?")) {
      return;
    }

    try {
      // ApiCall: DELETE /api/expenditures/:id
      await deleteExpenditureAPI(id);
      toast.success("Expenditure deleted successfully");
      await loadExpenditures();
    } catch (error) {
      console.error('Failed to delete expenditure:', error);
      toast.error("Failed to delete expenditure");
    }
  };

  const totalExpenditure = expenditures.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Maintenance": "bg-blue-100 text-blue-800 border-blue-200",
      "Repairs": "bg-orange-100 text-orange-800 border-orange-200",
      "Utilities": "bg-purple-100 text-purple-800 border-purple-200",
      "Security": "bg-green-100 text-green-800 border-green-200",
      "Cleaning": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Other": "bg-slate-100 text-slate-800 border-slate-200",
    };
    return colors[category] || colors["Other"];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading expenditures...</p>
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
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="h-8 w-8 text-red-600" />
                <h1 className="text-2xl md:text-3xl mb-0 text-slate-800 font-bold">Expenditures</h1>
              </div>
              <p className="text-slate-600">Track society expenses and spending</p>
            </div>
            {isAdmin() && (
              <Link to="/add-expenditure">
                <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expenditure
                </Button>
              </Link>
            )}
          </div>
        </div>

        <Card className="mb-6 border-red-100 shadow-lg bg-gradient-to-r from-red-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-red-800">Total Expenditure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl text-red-700">₹{totalExpenditure.toLocaleString()}</p>
            <p className="text-sm text-red-600 mt-2">{expenditures.length} expense records</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {expenditures.length > 0 ? (
            expenditures.map((expenditure) => (
              <Card key={expenditure.id} className="border-red-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-slate-800">{expenditure.description}</CardTitle>
                        <Badge variant="outline" className={getCategoryColor(expenditure.category)}>
                          {expenditure.category}
                        </Badge>
                      </div>
                      <CardDescription>
                        {new Date(expenditure.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl text-red-700">₹{expenditure.amount.toLocaleString()}</p>
                      {isAdmin() && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(expenditure.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card className="border-red-100 shadow-lg">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-500">No expenditure records found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
