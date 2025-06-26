
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentFaculty: any[];
  userEmail: string;
  selectedTransferTeacher: string;
  setSelectedTransferTeacher: (val: string) => void;
  transferReason: string;
  setTransferReason: (val: string) => void;
  handleConfirmTransfer: () => void;
}

const TransferDialog: React.FC<TransferDialogProps> = ({
  open,
  onOpenChange,
  departmentFaculty,
  userEmail,
  selectedTransferTeacher,
  setSelectedTransferTeacher,
  transferReason,
  setTransferReason,
  handleConfirmTransfer,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Transfer Timeslot</DialogTitle>
        <div className="text-muted-foreground text-sm mt-1">
          Select a faculty member to take your current lecture for today only.
        </div>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label>Faculty Member</Label>
          <Select
            value={selectedTransferTeacher}
            onValueChange={setSelectedTransferTeacher}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {departmentFaculty
                .filter(f => f.email !== userEmail && !f.isBlocked)
                .map(faculty => (
                  <SelectItem key={faculty.email} value={faculty.email}>
                    {faculty.name}
                    {faculty.role === "hod" ? " (HOD)" : ""}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Reason (optional)</Label>
          <Input
            value={transferReason}
            onChange={e => setTransferReason(e.target.value)}
            placeholder="e.g. Personal emergency"
          />
        </div>
        <Button
          onClick={handleConfirmTransfer}
          className="w-full"
          disabled={!selectedTransferTeacher}
        >
          Confirm Transfer
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default TransferDialog;
