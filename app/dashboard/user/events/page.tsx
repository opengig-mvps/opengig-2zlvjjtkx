"use client";

import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-picker";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Search } from "lucide-react";

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
}

const EventsPage: React.FC = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    date: Date | undefined;
    location: string;
    category: string;
  }>({
    date: undefined,
    location: "",
    category: "",
  });
  const searchParams = useSearchParams();
  const keyword = searchParams?.get("search") || "";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/events', { params: { ...selectedFilters, keyword } });
        setEvents(res?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [selectedFilters, keyword]);

  const handleRegister = async (eventId: number) => {
    try {
      const response = await api.post(`/api/events/${eventId}/register`, {});
      if (response?.data?.success) {
        toast.success("Registration successful! A confirmation email has been sent.");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="flex space-x-4 mb-8">
        <Input
          type="text"
          placeholder="Search events..."
          defaultValue={keyword}
        />
        <DateTimePicker
          date={selectedFilters?.date}
          setDate={(date: Date | undefined) => setSelectedFilters({ ...selectedFilters, date })}
        />
        <Select
          value={selectedFilters?.location}
          onValueChange={(value: string) => setSelectedFilters({ ...selectedFilters, location: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Location1">Location1</SelectItem>
            <SelectItem value="Location2">Location2</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedFilters?.category}
          onValueChange={(value: string) => setSelectedFilters({ ...selectedFilters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Category1">Category1</SelectItem>
            <SelectItem value="Category2">Category2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <LoaderCircleIcon className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event: Event) => (
            <Card key={event?.id}>
              <CardHeader>
                <CardTitle>{event?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Date: {new Date(event?.date).toLocaleDateString()}</p>
                <p>Time: {event?.time}</p>
                <p>Location: {event?.location}</p>
                <p>Category: {event?.category}</p>
                <p>{event?.description}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleRegister(event?.id)}>Register</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;