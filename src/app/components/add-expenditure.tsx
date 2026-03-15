import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { ArrowLeft, TrendingDown } from "lucide-react";
import { createExpenditureAPI } from "@/app/services/api";
import { toast } from "sonner";

export function AddExpenditure() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "",
    addedBy: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.category || !formData.addedBy) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      // ApiCall: POST /api/expenditures
      await createExpenditureAPI({
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        addedBy: formData.addedBy,
      });

      toast.success("Expenditure added successfully");
      setTimeout(() => {
        navigate("/expenditures");
      }, 1000);
    } catch (error) {
      console.error('Failed to add expenditure:', error);
      toast.error("Failed to add expenditure");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/expenditures">
          <Button variant="ghost" size="sm" className="mb-6 hover:bg-white/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expenditures
          </Button>
        </Link>

        <Card className="border-red-100 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Add Expenditure
            </CardTitle>
            <CardDescription>Record a new society expense</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Plumbing repairs in common area"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="border-red-200 focus:border-red-400 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="border-red-200 focus:border-red-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="border-red-200 focus:border-red-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="border-red-200 focus:border-red-400">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Repairs">Repairs</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addedBy">Added By *</Label>
                <Input
                  id="addedBy"
                  type="text"
                  placeholder="e.g., John Doe"
                  value={formData.addedBy}
                  onChange={(e) => setFormData({ ...formData, addedBy: e.target.value })}
                  required
                  className="border-red-200 focus:border-red-400"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Expenditure"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/expenditures")}
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