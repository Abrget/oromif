import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ArrowLeft, CreditCard, Smartphone, Shield, CheckCircle } from "lucide-react";
import { useToast } from "~/hooks/use-toast";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaymentStep = 'methods' | 'amount' | 'processing' | 'success';
type PaymentMethod = 'chapa' | 'santimpay';

export function PaymentDialog({ open, onOpenChange }: PaymentDialogProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('methods');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    {
      id: 'chapa' as PaymentMethod,
      name: 'Chapa',
      description: 'Fast and secure payments',
      icon: CreditCard,
      badge: 'Popular',
      badgeVariant: 'default' as const,
      fees: '2.5% + ETB 5',
      processingTime: 'Instant'
    },
    {
      id: 'santimpay' as PaymentMethod,
      name: 'SantimPay',
      description: 'Mobile money solution',
      icon: Smartphone,
      badge: 'Mobile',
      badgeVariant: 'secondary' as const,
      fees: '3% + ETB 3',
      processingTime: '1-2 minutes'
    }
  ];

  const resetDialog = () => {
    setCurrentStep('methods');
    setSelectedMethod(null);
    setAmount('');
    setIsProcessing(false);
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setCurrentStep('amount');
  };

  const handleBackToMethods = () => {
    setCurrentStep('methods');
    setSelectedMethod(null);
  };

  const calculateFees = (amount: number, method: PaymentMethod) => {
    if (method === 'chapa') {
      return (amount * 0.025) + 5;
    } else {
      return (amount * 0.03) + 3;
    }
  };

  const handleDeposit = async () => {
    if (!amount || !selectedMethod) return;
    
    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep('processing');
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('success');
      toast({
        title: "Deposit Successful!",
        description: `ETB ${depositAmount.toFixed(2)} has been added to your wallet`,
      });
    }, 3000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetDialog, 300); // Reset after dialog closes
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSelectedMethodDetails = () => {
    return paymentMethods.find(method => method.id === selectedMethod);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {currentStep !== 'methods' && currentStep !== 'success' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMethods}
                className="p-1 h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <span>
              {currentStep === 'methods' && 'Choose Payment Method'}
              {currentStep === 'amount' && 'Enter Amount'}
              {currentStep === 'processing' && 'Processing Payment'}
              {currentStep === 'success' && 'Payment Successful'}
            </span>
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'methods' && 'Select your preferred payment method to add money to your wallet'}
            {currentStep === 'amount' && 'Enter the amount you want to deposit'}
            {currentStep === 'processing' && 'Please wait while we process your payment'}
            {currentStep === 'success' && 'Your deposit has been completed successfully'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Methods Selection */}
          {currentStep === 'methods' && (
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={method.id}
                    className="p-4 cursor-pointer card-gradient hover:shadow-md transition-all hover:scale-[1.02]"
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-card-foreground">{method.name}</h3>
                            <Badge variant={method.badgeVariant} className="text-xs">
                              {method.badge}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Fees: {method.fees}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {method.processingTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Amount Input */}
          {currentStep === 'amount' && selectedMethod && (
            <div className="space-y-4">
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getSelectedMethodDetails()?.icon && 
                      React.createElement(getSelectedMethodDetails()!.icon, { 
                        className: "h-4 w-4 text-primary" 
                      })
                    }
                  </div>
                  <div>
                    <p className="font-medium text-sm">{getSelectedMethodDetails()?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Fees: {getSelectedMethodDetails()?.fees}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="amount">Deposit Amount (ETB)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg h-12"
                  min="1"
                />
              </div>

              {amount && parseFloat(amount) > 0 && (
                <Card className="p-3 bg-muted/30">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>{formatCurrency(calculateFees(parseFloat(amount), selectedMethod))}</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between font-semibold">
                      <span>Total to Pay:</span>
                      <span>{formatCurrency(parseFloat(amount) + calculateFees(parseFloat(amount), selectedMethod))}</span>
                    </div>
                  </div>
                </Card>
              )}

              <Button
                onClick={handleDeposit}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full h-12 bg-success hover:bg-success/90 text-success-foreground"
              >
                <Shield className="h-4 w-4 mr-2" />
                Deposit {amount && formatCurrency(parseFloat(amount))}
              </Button>
            </div>
          )}

          {/* Processing State */}
          {currentStep === 'processing' && (
            <div className="text-center py-8 space-y-4">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
              <div>
                <h3 className="font-semibold text-card-foreground">Processing Payment...</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please don't close this window
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {currentStep === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto h-16 w-16 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Deposit Successful!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {amount && formatCurrency(parseFloat(amount))} has been added to your wallet
                </p>
              </div>
              <Button onClick={handleClose} className="w-full">
                Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}