import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import Script from "next/script";
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mohitvirli.github.io"),
  title: "Grotesk ✌️",
  description: "A frontend developer by profession, a creative at heart.",
  keywords: "Grotesk, Frontend Engineer, React Developer, Three.js, Creative Developer, Web Development, Angular, JavaScript, TypeScript, Portfolio",
  authors: [{ name: "Grotesk" }],
  creator: "Grotesk",
  publisher: "Grotesk",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Grotesk - Frontend Engineer",
    description: "Frontend engineer by profession, creative at heart.",
    url: "https://mohitvirli.github.io",
    siteName: "Grotesk's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grotesk - Frontend Engineer",
    description: "Frontend engineer by profession, creative at heart.",
  },
  verification: {
    google: "GsRYY-ivL0F_VKkfs5KAeToliqz0gCrRAJKKmFkAxBA",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = "G-7WD4HM3XRE";

  return (
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
      </body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </html>
  );
}
