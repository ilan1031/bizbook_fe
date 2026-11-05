// Globals the app sets at runtime (third-party scripts).
export {};
declare global {
  interface Window {
    // Razorpay checkout script (loaded from a CDN tag, see the payment pages).
    Razorpay: any;
  }
}
