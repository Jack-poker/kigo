
import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  type: 'transfer' | 'deposit' | 'withdrawal';
}

const TransactionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      from: 'John Smith',
      to: 'Sarah Johnson',
      amount: 150.00,
      status: 'completed',
      date: '2024-06-12',
      type: 'transfer'
    },
    {
      id: 'TXN002',
      from: 'Mike Wilson',
      to: 'Alex Wilson',
      amount: 75.50,
      status: 'pending',
      date: '2024-06-12',
      type: 'transfer'
    },
    {
      id: 'TXN003',
      from: 'Lisa Brown',
      to: 'Emma Brown',
      amount: 200.00,
      status: 'failed',
      date: '2024-06-11',
      type: 'transfer'
    }
  ]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Management</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-emerald-700">Transaction ID</th>
                <th className="text-left p-4 font-medium text-emerald-700">From</th>
                <th className="text-left p-4 font-medium text-emerald-700">To</th>
                <th className="text-left p-4 font-medium text-emerald-700">Amount</th>
                <th className="text-left p-4 font-medium text-emerald-700">Status</th>
                <th className="text-left p-4 font-medium text-emerald-700">Date</th>
                <th className="text-left p-4 font-medium text-emerald-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-emerald-50/50">
                  <td className="p-4 font-medium">{transaction.id}</td>
                  <td className="p-4">{transaction.from}</td>
                  <td className="p-4">{transaction.to}</td>
                  <td className="p-4 font-semibold text-emerald-700">${transaction.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{transaction.date}</td>
                  <td className="p-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionManagement;