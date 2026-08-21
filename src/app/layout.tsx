import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Constella — See what students like you actually did",
  description: "Explore real alumni journeys, simulate major pivots, and discover career paths matched to your profile.",
  openGraph: {
    title: "Constella",
    description: "Explore real alumni journeys, simulate major pivots, and discover career paths matched to your profile.",
    siteName: "Constella",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Constella",
    description: "See what students like you actually did.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("constella-theme")||"light";document.documentElement.setAttribute("data-theme",t)}catch{document.documentElement.setAttribute("data-theme","light")}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
