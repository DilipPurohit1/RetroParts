import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './context/ToastContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { VehicleProvider } from './context/VehicleContext.js';
import { CartProvider } from './context/CartContext.js';
import { WishlistProvider } from './context/WishlistContext.js';
import { SocketProvider } from './context/SocketContext.js';

import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { MobileBottomNav } from './components/common/MobileBottomNav.js';
import { CartDrawer } from './components/marketplace/CartDrawer.js';
import { ProtectedRoute } from './components/common/ProtectedRoute.js';
import { AmbientBackground } from './components/common/AmbientBackground.js';

// Pages
import { Home } from './pages/Home.js';
import { Explore } from './pages/Explore.js';
import { ProductDetail } from './pages/ProductDetail.js';
import { SellPart } from './pages/SellPart.js';
import { WantedParts } from './pages/WantedParts.js';
import { WantedDetail } from './pages/WantedDetail.js';
import { Wishlist } from './pages/Wishlist.js';
import { Cart } from './pages/Cart.js';
import { Checkout } from './pages/Checkout.js';
import { Chat } from './pages/Chat.js';
import { UserDashboard } from './pages/UserDashboard.js';
import { SellerDashboard } from './pages/SellerDashboard.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { Profile } from './pages/Profile.js';
import { About } from './pages/About.js';
import { Contact } from './pages/Contact.js';
import { Garage } from './pages/Garage.js';
import { ApiDocs } from './pages/ApiDocs.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { GoogleCallback } from './pages/GoogleCallback.js';
import { NotFound } from './pages/NotFound.js';
import { useFaviconAnimation } from './hooks/useFaviconAnimation.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export function App() {
  // Live animated piston & flame in browser tab / title
  useFaviconAnimation();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <VehicleProvider>
              <CartProvider>
                <WishlistProvider>
                  <SocketProvider>
                    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-[#E5E5E5] font-sans selection:bg-[#E10600] selection:text-white pb-16 md:pb-0 relative">
                      {/* Subtle Clean Ambient Background */}
                      <AmbientBackground />

                      {/* Sticky Dual-Tier Header */}
                      <Navbar />

                      {/* Main Content Area */}
                      <main className="flex-1 relative z-10">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/explore" element={<Explore />} />
                          <Route path="/search" element={<Explore />} />
                          <Route path="/parts/:id" element={<ProductDetail />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/part/:id" element={<ProductDetail />} />
                          <Route path="/parts/slug/:slug" element={<ProductDetail />} />
                          <Route path="/listings/:id" element={<ProductDetail />} />
                          <Route
                            path="/sell"
                            element={
                              <ProtectedRoute>
                                <SellPart />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/wanted" element={<WantedParts />} />
                          <Route path="/wanted/new" element={<WantedParts />} />
                          <Route path="/how-it-works" element={<About />} />
                          <Route path="/faq" element={<About />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/docs" element={<ApiDocs />} />
                          <Route path="/wishlist" element={<Wishlist />} />

                          <Route
                            path="/garage"
                            element={
                              <ProtectedRoute>
                                <Garage />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route
                            path="/orders"
                            element={
                              <ProtectedRoute>
                                <UserDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/orders/:id"
                            element={
                              <ProtectedRoute>
                                <UserDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/messages"
                            element={
                              <ProtectedRoute>
                                <Chat />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/messages/:conversationId"
                            element={
                              <ProtectedRoute>
                                <Chat />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/notifications"
                            element={
                              <ProtectedRoute>
                                <UserDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <UserDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/buyer"
                            element={
                              <ProtectedRoute>
                                <UserDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/seller"
                            element={
                              <ProtectedRoute requireRole="seller">
                                <SellerDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/seller"
                            element={
                              <ProtectedRoute requireRole="seller">
                                <SellerDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin"
                            element={
                              <ProtectedRoute requireRole="admin">
                                <AdminDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard/admin"
                            element={
                              <ProtectedRoute requireRole="admin">
                                <AdminDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/profile/:id"
                            element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/auth/google/callback" element={<GoogleCallback />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>

                      {/* Slide-over Cart Drawer */}
                      <CartDrawer />

                      {/* Mobile Bottom Navigation Bar (5 tabs) */}
                      <MobileBottomNav />

                      {/* Footer */}
                      <Footer />
                    </div>
                  </SocketProvider>
                </WishlistProvider>
              </CartProvider>
            </VehicleProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
