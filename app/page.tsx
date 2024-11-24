'use client' ;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Star, Calendar, Share, Heart } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { gsap } from "gsap";
import { useEffect } from "react";

const LandingPage = () => {
  useEffect(() => {
    gsap.from(".hero-text", { opacity: 0, y: 50, duration: 1, ease: "power2.out" });
    gsap.from(".features-item", { opacity: 0, stagger: 0.3, duration: 1, ease: "power2.out" });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#ff7eb3] via-[#ff758c] to-[#ff6a88]">
      <main className="flex-1">
        <section className="w-full py-20">
          <div className="container px-6 mx-auto text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white hero-text">Book Your Dream Event with Ease</h1>
            <p className="mt-4 text-lg text-white opacity-90 hero-text">
              A platform designed for GenZ to effortlessly book and manage events with style.
            </p>
            <div className="flex justify-center mt-8 space-x-4 hero-text">
              <Button variant="outline" className="text-white border-white">Get Started</Button>
              <Button className="bg-white text-[#ff6a88]">Explore More</Button>
            </div>
          </div>
        </section>
        <section className="w-full py-20 bg-white">
          <div className="container px-6 mx-auto text-center features-item">
            <h2 className="text-3xl font-bold">Why Choose Us?</h2>
            <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
              <Card className="shadow-lg">
                <CardContent>
                  <Star className="w-12 h-12 mx-auto text-[#ff6a88]" />
                  <CardTitle className="mt-4 text-lg font-bold">Exclusive Features</CardTitle>
                  <p className="mt-2 text-sm text-gray-600">Access to unique features tailored for GenZ events.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent>
                  <Calendar className="w-12 h-12 mx-auto text-[#ff6a88]" />
                  <CardTitle className="mt-4 text-lg font-bold">Seamless Booking</CardTitle>
                  <p className="mt-2 text-sm text-gray-600">Book your favorite events with just a few clicks.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent>
                  <Heart className="w-12 h-12 mx-auto text-[#ff6a88]" />
                  <CardTitle className="mt-4 text-lg font-bold">Community Driven</CardTitle>
                  <p className="mt-2 text-sm text-gray-600">Connect with like-minded individuals and create memories.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-20">
          <div className="container px-6 mx-auto">
            <h2 className="text-3xl font-bold text-center text-white">Upcoming Events</h2>
            <Carousel className="mt-8">
              <CarouselContent>
                <CarouselItem>
                  <img src="https://picsum.photos/seed/picsum/200/300" alt="Event 1" className="w-full h-full rounded-lg" />
                </CarouselItem>
                <CarouselItem>
                  <img src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s" alt="Event 2" className="w-full h-full rounded-lg" />
                </CarouselItem>
                <CarouselItem>
                  <img src="https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY" alt="Event 3" className="w-full h-full rounded-lg" />
                </CarouselItem>
              </CarouselContent>
              <CarouselNext />
              <CarouselPrevious />
            </Carousel>
          </div>
        </section>
        <section className="w-full py-20 bg-white">
          <div className="container px-6 mx-auto">
            <h2 className="text-3xl font-bold text-center">Testimonials</h2>
            <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
              <Card className="shadow-lg">
                <Avatar>
                  <AvatarImage src="https://randomuser.me/api/portraits/women/1.jpg" />
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <CardContent>
                  <p className="mt-2 text-sm text-gray-600">"This platform made it so easy to find and book events. Perfect for spontaneous plans!"</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <Avatar>
                  <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" />
                  <AvatarFallback>JB</AvatarFallback>
                </Avatar>
                <CardContent>
                  <p className="mt-2 text-sm text-gray-600">"The user-friendly interface and community interaction are just amazing!"</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <Avatar>
                  <AvatarImage src="https://randomuser.me/api/portraits/women/2.jpg" />
                  <AvatarFallback>AG</AvatarFallback>
                </Avatar>
                <CardContent>
                  <p className="mt-2 text-sm text-gray-600">"I love the exclusive features and seamless booking experience!"</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gradient-to-t from-[#ff7eb3] via-[#ff758c] to-[#ff6a88] p-6 text-white">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 EventBooking GenZ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;