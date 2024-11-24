"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";

const NotificationSettingsPage: React.FC = () => {
  const { data: session } = useSession();
  const [enableReminders, setEnableReminders] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/users/${session?.user?.id}/notifications`);
        if (res?.data?.success) {
          setEnableReminders(res?.data?.data[0]?.enableReminders || false);
          toast.success(res?.data?.message);
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message);
        } else {
          console.error(error);
        }
      }
    };

    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const updateSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(`/api/users/${session?.user?.id}/settings`, {
        enableReminders,
      });
      if (res?.data?.success) {
        toast.success("Settings updated successfully!");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <Checkbox
            checked={enableReminders}
            onCheckedChange={() => setEnableReminders(!enableReminders)}
          />
          <span className="ml-2">Enable Event Reminders</span>
        </div>
        <Button onClick={updateSettings} disabled={loading}>
          {loading ? (
            <>
              <LoaderCircleIcon className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;