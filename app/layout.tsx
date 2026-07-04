import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanskar Gurukul Ashram School | Learn • Lead • Inspire",
  description: "Sanskar Gurukul Ashram School offers premium CBSE pattern education from Nursery to Class V. Dedicated to inspiring students with quality education, smart learning, and core values.",
  openGraph: {
    title: "Sanskar Gurukul Ashram School",
    description: "Premium CBSE pattern education from Nursery to Class V.",
    url: "https://sanskargurukul.com",
    siteName: "Sanskar Gurukul Ashram School",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanskar Gurukul Ashram School",
    description: "Premium CBSE pattern education from Nursery to Class V.",
  },
};

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}

export default RootLayout;
