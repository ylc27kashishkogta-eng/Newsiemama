/**
 * Dodo Payments Integration Client (Target: October 31)
 * 
 * Documentation & Setup:
 * 1. Register a merchant account at https://dodopayments.com
 * 2. Create a Product: "Curio Dispatch Patron Edition" ($4.99/mo)
 * 3. Add your publishable key in `src/config.ts` or `.env.local` as `VITE_DODO_PAYMENTS_KEY`
 * 4. See docs/integrations-oct31.md for complete webhook signature verification instructions.
 */

export interface DodoCheckoutOptions {
  productId: string;
  customerEmail?: string;
  customerName?: string;
  returnUrl?: string;
}

export const dodoPayments = {
  isConfigured(): boolean {
    const key = import.meta.env.VITE_DODO_PAYMENTS_KEY as string | undefined;
    return Boolean(key);
  },

  /**
   * Initializes the Dodo Payments overlay or redirects to hosted checkout
   */
  async createCheckoutSession(options: DodoCheckoutOptions): Promise<{ url?: string; sessionId?: string }> {
    if (!this.isConfigured()) {
      console.info(
        '[DodoPayments] Running in sandbox/demo mode. Live keys not configured yet.',
        options
      );
      return {
        sessionId: `mock_sess_${Date.now()}`,
        url: '#mock-checkout-success',
      };
    }

    try {
      const apiKey = import.meta.env.VITE_DODO_PAYMENTS_KEY as string;
      const response = await fetch('https://api.dodopayments.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          product_id: options.productId,
          customer_name: options.customerName,
          customer_email: options.customerEmail,
          return_url: options.returnUrl || window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error(`Dodo API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[DodoPayments] Checkout creation failed:', error);
      throw error;
    }
  },
};
