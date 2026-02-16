import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";
const app = express();

app.use(cors({origin:ENV.FRONTEND_URL}))
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to Productify API - Powered by PostgreSQL, DrizzleORM and Clerk Auth",
    endpoint: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});
app.listen(ENV.PORT, () =>
  console.log("Server is up ans running on PORT :", ENV.PORT),
);
