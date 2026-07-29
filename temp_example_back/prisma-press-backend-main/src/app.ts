import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import notFound from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";
import { premiumRoutes } from "./modules/premium/premium.route";

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// const endpointSecret = config.stripe_webhook_secret;

// Webhook route for Stripe
// app.post(
//   "/api/subscription/webhook",
//   express.raw({ type: "application/json" }),
//   (request: Request, response: Response) => {
//     let event = request.body;
//     console.log(event, "Stripe request body");
//     console.log(request.headers, "Stripe request headers");
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//       // Get the signature sent by Stripe
//       const signature = request.headers["stripe-signature"];
//       try {
//         // converting event buffer to a valid object
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature as string,
//           endpointSecret,
//         );
//       } catch (err: any) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message);
//         return response
//           .status(400)
//           .json({ message: `Webhook Error: ${err.message}` });
//       }
//     }

//     console.log(event, "event after try block");

//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntent = event.data.object;
//         console.log(
//           `PaymentIntent for ${paymentIntent.amount} was successful!`,
//         );
//         // Then define and call a method to handle the successful payment intent.
//         // handlePaymentIntentSucceeded(paymentIntent);
//         break;
//       case "payment_method.attached":
//         const paymentMethod = event.data.object;
//         // Then define and call a method to handle the successful attachment of a PaymentMethod.
//         // handlePaymentMethodAttached(paymentMethod);
//         break;
//       default:
//         // Unexpected event type
//         console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   },
// );

// Webhook route for Stripe
app.use("/api/subscription/webhook", express.raw({ type: "application/json" }));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing cookies

// Home/Root route
app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to the Prisma Press API!");
});

// User routes
app.use("/api/users", userRoutes);

//Login routes
app.use("/api/auth", authRoutes);

// Post routes
app.use("/api/posts", postRoutes);

// Comment routes
app.use("/api/comments", commentRoutes);

// Subscription routes
app.use("/api/subscription", subscriptionRoutes);

// Premium routes
app.use("/api/premium", premiumRoutes);

// The Not Found middleware (Catches anything that didn't match above)
app.use(notFound);

// Global error handler middleware (Catches server crashes/thrown errors)
app.use(globalErrorHandler);

export default app;
