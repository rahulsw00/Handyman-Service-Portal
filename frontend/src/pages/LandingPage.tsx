import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HandymanLandingPage() {
  return (
    <div className="flex items-center justify-center h-full w-screen">
      <div className="flex flex-col min-h-screen font-sans bg-gray-50 items-center">
        <div className="w-full max-w-5xl">
          {/* Hero Section */}
          <section className="py-12 md:py-20 bg-white w-full">
            <div className="w-fill px-4 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                  Find Trusted Handyman Services Anytime, Anywhere
                </h1>
                <p className="text-lg text-gray-600">
                  Connecting you with{" "}
                  <span className="text-blue-600 font-medium">
                    skilled professionals
                  </span>{" "}
                  to get the job done right. From repairs to renovations, we've
                  got you covered.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" className="px-6">
                    Hire a Handyman
                  </Button>
                  <Button size="lg" variant="outline" className="px-6">
                    Register as a Handyman
                  </Button>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg aspect-video overflow-hidden">
                <img
                  src="../src/assets/handyman home.jpg"
                  alt="Handyman at work"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
          {/* How It Works */}
          <section className="py-16 bg-gray-100 w-full">
            <div className="w-full px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                HOW IT WORKS
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-white rounded-lg aspect-video overflow-hidden shadow-md">
                  <img
                    src="../src/assets/illustration.jpg"
                    alt="Working process illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                  Reliable Repairs. Honest Service. Every Time.
                  </h3>
                  
                </div>
              </div>
            </div>
          </section>
          {/* Why Choose Us */}
          <section className="py-16 bg-white w-full">
            <div className="w-full px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                WHY CHOOSE US
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-blue-50 rounded-full p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mb-4 text-xl font-bold">
                    <span className="text-2xl">&#128737;</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Trusted Professionals
                  </h3>
                  <p className="text-gray-600">
                    All our handymen are vetted, background-checked, and skilled
                    in their craft.
                  </p>
                </div>
                <div className="bg-blue-50 rounded-full p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mb-4 text-xl font-bold">
                    <span className="text-2xl">&#9202;</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Quick Response
                  </h3>
                  <p className="text-gray-600">
                    Get connected with available handymen in your area within
                    minutes.
                  </p>
                </div>
                <div className="bg-blue-50 rounded-full p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mb-4 text-xl font-bold">
                    <span className="text-2xl">&#10004;</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Satisfaction Guaranteed
                  </h3>
                  <p className="text-gray-600">
                    If you're not happy with the work, we'll make it right.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* About Us */}
          <section className="py-16 bg-gray-50 w-full">
            <div className="w-full px-4">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                About Us
              </h2>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="text-gray-600 mb-6">
                  HandyMan Pro connects homeowners with qualified local
                  professionals for all your home repair and improvement needs.
                  Our platform makes it easy to find, book, and pay for handyman
                  services, ensuring a hassle-free experience from start to
                  finish.
                </p>
                <p className="text-gray-600">
                  Founded in 2022, we've helped thousands of customers complete
                  projects of all sizes, from simple repairs to complex
                  renovations. Our mission is to make home maintenance
                  accessible and affordable for everyone.
                </p>
              </div>
              <div className="border-t border-dashed pt-12">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                  Testimonials
                </h3>
                <Tabs defaultValue="testimonial-1" className="w-full">
                  <TabsContent value="testimonial-1">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     
                        <Card  className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className="text-yellow-500 text-lg"
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                              "Needed help with a bunch of little tasks before moving out—painting touch-ups, curtain installation, and replacing a light fixture. They handled it all with ease and even cleaned up after themselves. Super convenient and saved me a lot of time!"
                            </p>
                            <p className="font-medium">- Akash P.</p>
                          </CardContent>
                        </Card>
                     
                        <Card  className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className="text-yellow-500 text-lg"
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                            "I had a great experience with this handyman service! They arrived on time, brought all the necessary tools, and completed multiple tasks around my home—including fixing a leaky faucet and hanging shelves—quickly and efficiently. Very professional and reasonably priced. Highly recommend!"
                            </p>
                            <p className="font-medium">- Harshavardhan R.</p>
                          </CardContent>
                        </Card>
                        <Card  className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className="text-yellow-500 text-lg"
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                              "Absolutely amazing service! The handyman was friendly, explained everything he was doing, and finished the job faster than I expected. He fixed my door, installed a curtain rod, and even helped move some furniture. Will definitely call them again!"
                            </p>
                            <p className="font-medium">- Sunil J.</p>
                          </CardContent>
                        </Card>
                        <Card  className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className="text-yellow-500 text-lg"
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                              "It’s rare to find someone who is both skilled and trustworthy these days. The handyman not only did a great job fixing my kitchen cabinets, but he also noticed a safety issue with my porch railing and fixed it without charging extra. Very honest and hardworking!"
                            </p>
                            <p className="font-medium">- Rohan J.</p>
                          </CardContent>
                        </Card>
                     
                    </div>
                  </TabsContent>
                  <div className="flex justify-center mt-6">
                    <TabsList>
                      <TabsTrigger
                        value="testimonial-1"
                        className="rounded-full w-2 h-2 p-0 mx-1"
                      ></TabsTrigger>
                      <TabsTrigger
                        value="testimonial-2"
                        className="rounded-full w-2 h-2 p-0 mx-1"
                      ></TabsTrigger>
                      <TabsTrigger
                        value="testimonial-3"
                        className="rounded-full w-2 h-2 p-0 mx-1"
                      ></TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
              </div>
            </div>
          </section>
          {/* CTA Section */}
          <section className="py-16 bg-white w-full">
            <div className="w-full px-4 text-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Ready to get started?
              </h2>
              <div className="max-w-xl mx-auto mb-8">
                <p className="mb-2">
                  A paragraph of text with an{" "}
                  <a href="#" className="text-blue-600 underline">
                    unsigned link
                  </a>
                  .
                </p>
                <p className="mb-2">
                  A second row of text with a{" "}
                  <a href="#" className="text-blue-600 underline">
                    web link
                  </a>
                  .
                </p>
                <p className="flex justify-center items-center">
                  <span className="mr-2 text-blue-600 inline-block">🔧</span>
                  <span>An icon inline with text.</span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="px-8 py-6 text-lg">
                  Hire a Handyman
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg"
                >
                  Register as a Handyman
                </Button>
              </div>
            </div>
          </section>
        </div>
        {/* Footer */}
        <footer className="bg-gray-100 border-t px-10 w-screen">
          <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                Stay connected
              </h3>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="text-gray-600 hover:text-blue-700">
                  About Us
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-700">
                  Contact Us
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-700">
                  FAQs
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-700">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-700">
                  Terms of Service
                </a>
              </div>
            </div>
            <div className="border-t pt-6 text-center text-gray-500 text-sm">
              <p>© 2025 HandyMan. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
