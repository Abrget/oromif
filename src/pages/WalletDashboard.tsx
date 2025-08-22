import { useState } from "react";
import { Card } from "~/components/ui/card"; 
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { PaymentDialog } from "~/components/PaymentDialog";
import { 
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  User,
  CreditCard,
  TrendingUp
} from "lucide-react";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  method?: string;
}
import Link from "next/link";
import {
 
  SettingsGearSvg,
} from "~/components/Svgs";

export default WalletDashboard

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1500,
    status: 'completed',
    date: '2024-01-20T10:30:00Z',
    description: 'Deposit via Chapa',
    method: 'Chapa'
  },
  {
    id: '2',
    type: 'withdraw',
    amount: 500,
    status: 'pending',
    date: '2024-01-19T14:15:00Z',
    description: 'Withdrawal to Bank',
    method: 'Bank Transfer'
  },
  {
    id: '3',
    type: 'deposit',
    amount: 2000,
    status: 'completed',
    date: '2024-01-18T09:45:00Z',
    description: 'Deposit via SantimPay',
    method: 'SantimPay'
  },
  {
    id: '4',
    type: 'transfer',
    amount: 750,
    status: 'failed',
    date: '2024-01-17T16:20:00Z',
    description: 'Transfer to John Doe',
    method: 'Wallet Transfer'
  }
];

export function WalletDashboard() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [balance] = useState(15750.50);
  const ProfileTopBar = () => {
    return (
      <div className="fixed left-0 right-0 top-0 flex h-16 items-center justify-between border-b-2 border-gray-200 bg-white px-5 text-xl font-bold text-gray-300 md:hidden">
        <div className="invisible" aria-hidden={true}>
          <SettingsGearSvg />
        </div>
        <span className="text-gray-400">Profile</span>
        <Link href="/settings/account">
          <SettingsGearSvg />
          <span className="sr-only">Settings</span>
        </Link>
      </div>
    );
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="status-success">Completed</Badge>;
      case 'pending':
        return <Badge className="status-pending">Pending</Badge>;
      case 'failed':
        return <Badge className="status-failed">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case 'withdraw':
        return <ArrowUpRight className="h-4 w-4 text-warning" />;
      case 'transfer':
        return <ArrowUpRight className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div>
         <ProfileTopBar />
         <LeftBar selectedTab="Profile" />
         <div className="flex justify-center gap-3 pt-14 md:ml-24 lg:ml-64 lg:gap-12">
      <div className="max-w-7xl mx-auto space-y-6">
      
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Wallet Dashboard</h1>
              <p className="text-muted-foreground">Manage your finances with ease</p>
            </div>
          </div>
          
        </div>

        {/* Balance and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Card */}
          <Card className="lg:col-span-2 p-6 card-primary animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary-foreground/80" />
                <span className="text-primary-foreground/80">Total Balance</span>
              </div>
              <TrendingUp className="h-5 w-5 text-primary-foreground/80" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-primary-foreground">
                {formatCurrency(balance)}
              </h2>
              <p className="text-primary-foreground/70">
                +12.5% from last month
              </p>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 card-gradient animate-slide-up">
            <h3 className="font-semibold mb-4 text-card-foreground">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start gap-3 h-12 bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => setShowPaymentDialog(true)}
              >
                <Plus className="h-4 w-4" />
                Deposit Money
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12 border-warning text-warning hover:bg-warning/10"
              >
                <Minus className="h-4 w-4" />
                Withdraw Money
              </Button>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="p-6 card-gradient animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-card-foreground">Recent Transactions</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-card-hover transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)} • {transaction.method}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'deposit' ? 'text-success' : 'text-foreground'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Dialog */}
        <PaymentDialog 
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
        />
      </div>
      </div>
       <div className="pt-[90px]"></div>
        <BottomBar selectedTab="Profile" />
    </div>
  );
}