import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentBasket Feedback | Share Your Experience",
  description: "Help us improve your comfort by sharing your RentBasket experience. Your feedback goes directly to our team.",
  keywords: ["RentBasket", "feedback", "review", "customer experience"],
  openGraph: {
    title: "RentBasket Feedback",
    description: "Share your RentBasket experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
