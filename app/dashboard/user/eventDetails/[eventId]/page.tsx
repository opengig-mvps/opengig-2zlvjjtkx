"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [eventDetails, setEventDetails] = useState<any>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/events/${eventId}`);
        if (res?.data?.success) {
          setEventDetails(res?.data?.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const registerForEvent = async () => {
    if (!session) {
      toast.error("You must be logged in to register for events.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/api/events/${eventId}/register`);
      if (res?.data?.success) {
        toast.success("Registration successful! A confirmation email has been sent.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to register for the event.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    );
  }

  if (!eventDetails) {
    return <div>No event details found.</div>;
  }

  return (
    <div className="flex-1 p-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{eventDetails?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Date:</strong> {new Date(eventDetails?.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {eventDetails?.time}</p>
          <p><strong>Location:</strong> {eventDetails?.location}</p>
          <p><strong>Description:</strong> {eventDetails?.description}</p>
        </CardContent>
      </Card>
      <Button onClick={registerForEvent} disabled={loading}>
        {loading ? <LoaderCircleIcon className="h-4 w-4 animate-spin" /> : "Register for Event"}
      </Button>
    </div>
  );
};

export default EventDetailsPage;