
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import TimeSelect from "@/components/timetable/TimeSelect";

/**
 * Show a muted, gray, non-selectable option if no data is available.
 */
const EmptyDropdownMessage = ({ message }: { message: string }) => (
  <div className="px-4 py-2 text-muted-foreground text-sm">{message}</div>
);

interface SessionDetailsProps {
  myClasses: any[];
  selectedClass: string;
  setSelectedClass: (v: string) => void;
  divisions: any[];
  selectedDivision: string;
  setSelectedDivision: (v: string) => void;
  classSubjects: any[];
  selectedSubject: string;
  setSelectedSubject: (v: string) => void;
  selectedTimeslot: string;
  setSelectedTimeslot: (v: string) => void;
  myTimeslots?: any[]; // New prop
}

const SessionDetails: React.FC<SessionDetailsProps> = ({
  myClasses,
  selectedClass,
  setSelectedClass,
  divisions,
  selectedDivision,
  setSelectedDivision,
  classSubjects,
  selectedSubject,
  setSelectedSubject,
  selectedTimeslot,
  setSelectedTimeslot,
  myTimeslots = [],
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        Session Details
      </CardTitle>
      <CardDescription>
        Select the class, subject, division, and timeslot for attendance marking
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* CLASS */}
        <div className="space-y-2">
          <Label>Class</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass} disabled={myClasses.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {myClasses.length === 0 ? (
                <EmptyDropdownMessage message="No classes assigned" />
              ) : (
                myClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {/* DIVISION */}
        <div className="space-y-2">
          <Label>Division</Label>
          <Select
            value={selectedDivision}
            onValueChange={setSelectedDivision}
            disabled={!selectedClass || divisions.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select division" />
            </SelectTrigger>
            <SelectContent>
              {divisions.length === 0 ? (
                <EmptyDropdownMessage message="No divisions available" />
              ) : (
                divisions.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    {division.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {/* SUBJECT */}
        <div className="space-y-2">
          <Label>Subject</Label>
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            disabled={classSubjects.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {classSubjects.length === 0 ? (
                <EmptyDropdownMessage message="No subjects assigned" />
              ) : (
                classSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {/* TIMESLOT */}
        <div className="space-y-2">
          <Label>Timeslot</Label>
          <Select
            value={selectedTimeslot}
            onValueChange={setSelectedTimeslot}
            disabled={myTimeslots.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeslot" />
            </SelectTrigger>
            <SelectContent>
              {myTimeslots.length === 0 ? (
                <EmptyDropdownMessage message="No timeslots assigned" />
              ) : (
                myTimeslots.map(slot => (
                  <SelectItem key={slot.id} value={slot.id}>
                    {/* Only show time, not day */}
                    {slot.startTime} - {slot.endTime}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default SessionDetails;
