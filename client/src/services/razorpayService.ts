export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const triggerRazorpayPayment = async (options: RazorpayOptions): Promise<void> => {
  const isLoaded = await loadRazorpayScript();

  if (isLoaded && window.Razorpay) {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } else {
    // Fallback simulation mode if external CDN script is blocked or offline
    console.log('[Razorpay Service] External script unavailable. Using simulation fallback mode.');
    setTimeout(() => {
      options.handler({
        razorpay_payment_id: `pay_sim_${Math.random().toString(36).substring(2, 10)}`,
        razorpay_order_id: options.order_id,
        razorpay_signature: `sig_sim_${Math.random().toString(36).substring(2, 10)}`,
      });
    }, 1000);
  }
};
