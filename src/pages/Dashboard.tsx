import { DollarSign, TrendingUp, TrendingDown, BarChart3, Users, ShoppingCart } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/charts/SalesChart";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockData, getSummaryStats } from "@/data/mockData";

export default function Dashboard() {
  const stats = getSummaryStats();
  const recentTransactions = mockData.transactions.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Track your billing system performance and metrics</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          gradient
        />
        <MetricCard
          title="Total Purchases"
          value={`$${stats.totalPurchases.toLocaleString()}`}
          change="+8.2% from last month"
          changeType="positive"
          icon={TrendingDown}
        />
        <MetricCard
          title="Net Profit"
          value={`$${stats.totalProfit.toLocaleString()}`}
          change="+15.3% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Transactions"
          value={stats.totalTransactions.toString()}
          change="+7% from last month"
          changeType="positive"
          icon={BarChart3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={mockData.monthlyData} />
        </div>
        <div>
          <CategoryPieChart 
            data={mockData.salesCategories} 
            title="Sales by Category" 
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'sales' ? 'bg-chart-primary' : 'bg-chart-secondary'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                    {transaction.status}
                  </Badge>
                  <span className={`font-semibold ${
                    transaction.type === 'sales' ? 'text-chart-primary' : 'text-chart-secondary'
                  }`}>
                    {transaction.type === 'sales' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}