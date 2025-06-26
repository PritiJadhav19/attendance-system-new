
import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import TodaySlotsList from "@/components/transfers/TodaySlotsList";
import TransferRequestsList from "@/components/transfers/TransferRequestsList";
import TransferDialog from "@/components/timetable/TransferDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Simulated data, replace with data fetching as needed
const sampleTimeSlots = [
  // These would be fetched based on the logged-in faculty for "today"
  // { id, startTime, endTime, subject, class, ... }
];

const sampleTransfers = [
  // Transfer requests list/history for the user
  // { id, slot, to, from, status, reason, date }
];

const MyTransfers: React.FC = () => {
  const { user, getDepartmentalFaculty } = useUser();
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // These states are used for the transfer dialog
  const [selectedTransferTeacher, setSelectedTransferTeacher] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const { toast } = useToast();

  // Simulate today's assigned timeslots
  const todaySlots = sampleTimeSlots; // Replace with real data as needed

  // Simulate transfer history
  const transferRequests = sampleTransfers; // Replace with real data as needed

  // Get department faculty if possible (may be empty for some users)
  const departmentFaculty = getDepartmentalFaculty ? getDepartmentalFaculty() : [];

  const handleOpenTransferDialog = (slot: any) => {
    setSelectedSlot(slot);
    setTransferDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    // TODO: Implement transfer submission (Supabase integration, etc.)
    toast({ title: "Transfer Requested", description: "Your transfer request was submitted." });
    setTransferDialogOpen(false);
    setSelectedTransferTeacher("");
    setTransferReason("");
  };

  return (
    <div className="container max-w-3xl py-6">
      <h1 className="text-2xl font-bold mb-6">My Lecture Transfers</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Today's Lectures</CardTitle>
        </CardHeader>
        <CardContent>
          <TodaySlotsList
            user={user}
            slots={todaySlots}
            onTransfer={handleOpenTransferDialog}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>My Transfer Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <TransferRequestsList user={user} transfers={transferRequests} />
        </CardContent>
      </Card>
      <TransferDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        departmentFaculty={departmentFaculty}
        userEmail={user?.email || ""}
        selectedTransferTeacher={selectedTransferTeacher}
        setSelectedTransferTeacher={setSelectedTransferTeacher}
        transferReason={transferReason}
        setTransferReason={setTransferReason}
        handleConfirmTransfer={handleConfirmTransfer}
      />
    </div>
  );
};

export default MyTransfers;

