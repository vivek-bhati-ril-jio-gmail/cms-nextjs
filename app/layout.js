// import sequelize from '../lib/sequelize';
import createSuperAdmin from '../app/seeders/superAdminSeeder';  // Seeder to create super admin
import localFont from "next/font/local"; // Import local fonts
import { AuthProvider } from './context/AuthContext'; // Authentication context provider
import Header from './components/Header'; // Sticky header component
import './globals.css'; // Include global styles

await createSuperAdmin();

// Import fonts locally using Next.js font system
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans", // Use this font variable throughout the app
  weight: "100 900", // Font weight range
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono", // Use this font variable throughout the app
  weight: "100 900", // Font weight range
});

// Metadata for SEO and title
export const metadata = {
  title: "My Awesome App",
  description: "A modern web application built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Optionally, add meta tags or other head elements */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Authentication provider to wrap the app for authentication state */}
        <AuthProvider>
          {/* Sticky header component that appears globally */}
          <Header />
          {/* Main content of the page */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
