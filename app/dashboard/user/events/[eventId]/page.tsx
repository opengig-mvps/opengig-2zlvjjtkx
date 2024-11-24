"use client";
import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";

interface EventDetails {
  id: number;
  date: string;
  name: string;
  time: string;
  category: string;
  location: string;
  description: string;
}

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: session } = useSession();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [addingToCalendar, setAddingToCalendar] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/events/${eventId}`);
        if (response?.data?.success) {
          setEvent(response?.data?.data);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const addToCalendar = async () => {
    if (!session || !event) return;

    try {
      setAddingToCalendar(true);
      const response = await axios.post(
        `/api/users/${session?.user?.id}/events/${event?.id}/addToCalendar`
      );
      if (response?.data?.success) {
        toast.success("Event added to calendar successfully!");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setAddingToCalendar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircleIcon className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      {event && (
        <Card>
          <CardHeader>
            <CardTitle>{event?.name}</CardTitle>
            <CardDescription>{event?.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event?.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {event?.time}
              </p>
              <p>
                <strong>Location:</strong> {event?.location}
              </p>
              <p>
                <strong>Description:</strong> {event?.description}
              </p>
            </div>
            <Button
              className="mt-4"
              onClick={addToCalendar}
              disabled={addingToCalendar}
            >
              {addingToCalendar ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Adding to Calendar...
                </>
              ) : (
                "Add to Calendar"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventDetailsPage;