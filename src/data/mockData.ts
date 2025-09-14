// Mock data for billing system dashboard and analytics

export interface Transaction {
  id: string;
  type: 'sales' | 'purchase';
  amount: number;
  category: string;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface MonthlyData {
  month: string;
  sales: number;
  purchases: number;
  profit: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// Generate realistic billing data
export const generateMonthlyData = (): MonthlyData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => {
    const baseSales = 45000 + (Math.sin(index * 0.5) * 15000) + (Math.random() * 10000);
    const basePurchases = baseSales * 0.6 + (Math.random() * 5000);
    return {
      month,
      sales: Math.round(baseSales),
      purchases: Math.round(basePurchases),
      profit: Math.round(baseSales - basePurchases)
    };
  });
};

export const generateTransactions = (): Transaction[] => {
  const categories = ['Hardware', 'Software', 'Services', 'Consulting', 'Maintenance', 'Training'];
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < 50; i++) {
    const isLast30Days = i < 30;
    const date = new Date();
    if (isLast30Days) {
      date.setDate(date.getDate() - i);
    } else {
      date.setDate(date.getDate() - (30 + Math.floor(Math.random() * 60)));
    }
    
    transactions.push({
      id: `txn_${i.toString().padStart(3, '0')}`,
      type: Math.random() > 0.6 ? 'sales' : 'purchase',
      amount: Math.round((Math.random() * 15000) + 500),
      category: categories[Math.floor(Math.random() * categories.length)],
      date: date.toISOString().split('T')[0],
      description: `Transaction for ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()}`,
      status: Math.random() > 0.1 ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'cancelled')
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const generateCategoryData = (type: 'sales' | 'purchase'): CategoryData[] => {
  const colors = ['hsl(215, 85%, 55%)', 'hsl(168, 85%, 55%)', 'hsl(45, 93%, 47%)', 'hsl(142, 76%, 36%)', 'hsl(25, 95%, 53%)', 'hsl(0, 84%, 60%)'];
  const categories = ['Hardware', 'Software', 'Services', 'Consulting', 'Maintenance', 'Training'];
  
  return categories.map((category, index) => ({
    name: category,
    value: Math.round(Math.random() * 25000 + 5000),
    color: colors[index]
  }));
};

export const generateDailyData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: Math.round(Math.random() * 8000 + 2000),
      purchases: Math.round(Math.random() * 5000 + 1000),
      profit: 0
    });
  }
  
  return data.map(item => ({
    ...item,
    profit: item.sales - item.purchases
  }));
};

export const mockData = {
  monthlyData: generateMonthlyData(),
  transactions: generateTransactions(),
  salesCategories: generateCategoryData('sales'),
  purchaseCategories: generateCategoryData('purchase'),
  dailyData: generateDailyData()
};

// Summary statistics
export const getSummaryStats = () => {
  const transactions = mockData.transactions;
  const thisMonth = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  });

  const totalSales = thisMonth.filter(t => t.type === 'sales').reduce((sum, t) => sum + t.amount, 0);
  const totalPurchases = thisMonth.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0);
  const totalProfit = totalSales - totalPurchases;
  const totalTransactions = thisMonth.length;

  return {
    totalSales,
    totalPurchases,
    totalProfit,
    totalTransactions,
    profitMargin: totalSales > 0 ? ((totalProfit / totalSales) * 100) : 0
  };
};