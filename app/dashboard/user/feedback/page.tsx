"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Zod schema for feedback form
const feedbackSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
  comments: z.string().min(1, "Comments are required"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const FeedbackForm: React.FC = () => {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      const payload = {
        rating: data?.rating,
        comments: data?.comments,
        eventId: 1, // Assuming eventId is 1 for this example
      };

      const response = await api.post(
        `/api/users/${session?.user?.id}/feedback`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Feedback submitted successfully!");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Submit Event Feedback</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Feedback Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input {...register("rating")} type="number" placeholder="Enter rating" />
              {errors?.rating && (
                <p className="text-red-500 text-sm">{errors?.rating?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                {...register("comments")}
                placeholder="Enter your comments"
              />
              {errors?.comments && (
                <p className="text-red-500 text-sm">{errors?.comments?.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FeedbackForm;