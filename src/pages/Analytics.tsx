import { useState } from "react";
import { Calendar, Filter, Download, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  ComposedChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { mockData, generateCategoryData } from "@/data/mockData";

export default function Analytics() {
  const [dateRange, setDateRange] = useState("30");
  const [chartType, setChartType] = useState("sales");
  const [viewType, setViewType] = useState("combined");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: ${entry.value?.toLocaleString() || 0}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const filteredData = chartType === "sales" 
    ? mockData.dailyData.map(d => ({ ...d, value: d.sales }))
    : chartType === "purchases"
    ? mockData.dailyData.map(d => ({ ...d, value: d.purchases }))
    : mockData.dailyData;

  const categoryData = chartType === "sales" ? mockData.salesCategories : mockData.purchaseCategories;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your billing system performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="purchases">Purchases</SelectItem>
                <SelectItem value="combined">Combined</SelectItem>
              </SelectContent>
            </Select>

            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="combined">Combined</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="secondary" className="ml-auto">
              {dateRange} days • {chartType} • {viewType}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Trend Analysis - {chartType === 'combined' ? 'Sales vs Purchases' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {viewType === 'line' ? (
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {chartType === 'combined' ? (
                      <>
                        <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-primary))" strokeWidth={2} name="Sales" />
                        <Line type="monotone" dataKey="purchases" stroke="hsl(var(--chart-secondary))" strokeWidth={2} name="Purchases" />
                        <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-success))" strokeWidth={2} name="Profit" />
                      </>
                    ) : (
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-primary))" strokeWidth={3} />
                    )}
                  </LineChart>
                ) : viewType === 'area' ? (
                  <AreaChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {chartType === 'combined' ? (
                      <>
                        <Area type="monotone" dataKey="sales" stackId="1" stroke="hsl(var(--chart-primary))" fill="hsl(var(--chart-primary))" fillOpacity={0.3} name="Sales" />
                        <Area type="monotone" dataKey="purchases" stackId="1" stroke="hsl(var(--chart-secondary))" fill="hsl(var(--chart-secondary))" fillOpacity={0.3} name="Purchases" />
                      </>
                    ) : (
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-primary))" fill="hsl(var(--chart-primary))" fillOpacity={0.3} />
                    )}
                  </AreaChart>
                ) : viewType === 'bar' ? (
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {chartType === 'combined' ? (
                      <>
                        <Bar dataKey="sales" fill="hsl(var(--chart-primary))" name="Sales" />
                        <Bar dataKey="purchases" fill="hsl(var(--chart-secondary))" name="Purchases" />
                      </>
                    ) : (
                      <Bar dataKey="value" fill="hsl(var(--chart-primary))" />
                    )}
                  </BarChart>
                ) : (
                  <ComposedChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="sales" fill="hsl(var(--chart-primary))" name="Sales" />
                    <Bar dataKey="purchases" fill="hsl(var(--chart-secondary))" name="Purchases" />
                    <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-success))" strokeWidth={3} name="Profit" />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Category Breakdown - {chartType === 'combined' ? 'Sales' : chartType.charAt(0).toUpperCase() + chartType.slice(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">$47.2K</div>
                  <div className="text-sm text-muted-foreground">Avg Monthly Sales</div>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent">$28.5K</div>
                  <div className="text-sm text-muted-foreground">Avg Monthly Purchases</div>
                </div>
              </div>
              <div className="text-center p-4 bg-success/5 rounded-lg">
                <div className="text-2xl font-bold text-success">39.6%</div>
                <div className="text-sm text-muted-foreground">Average Profit Margin</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Growth Rate</span>
                  <span className="font-medium text-success">+12.5%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}