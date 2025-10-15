import { facilitator } from "@coinbase/x402";
import { paymentMiddleware } from "x402-next";

const payTo = process.env.RESOURCE_WALLET_ADDRESS as `0x${string}`;
const network = process.env.NETWORK || "base";

export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/tip": {
      price: "$0.005", // Default tip amount
      network,
      config: {
        description: "Send tip to content creator",
      },
    },
  },
  facilitator,
);

export const config = {
  matcher: ["/api/tip"],
  runtime: "nodejs",
};
