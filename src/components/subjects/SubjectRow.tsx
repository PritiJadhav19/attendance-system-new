import React, { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { SubjectSchedule } from './SubjectSchedule';

interface SubjectRowProps {
  subject: any;
  type: 'theory' | 'practical';
}

export const SubjectRow: React.FC<SubjectRowProps> = ({ subject, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { classes, getTimeSlotsForSubject } = useUser();

  const subjectClass = classes.find(cls => cls.id === subject.classId);

  // GET LECTURE SLOTS
  const lectureSlots = getTimeSlotsForSubject(subject.id, type);

  // Start with NA display and improve further below
  let divisionDisplay = "N/A";

  // SAFETY: grab divisions (or empty array)
  const divisions = subjectClass?.divisions || [];

  // For debugging
  // console.log('Subject:', subject);
  // console.log('Class:', subjectClass);
  // console.log('Divisions:', divisions);

  if (subjectClass) {
    if (type === "theory") {
      // 1. Single division, no info in subject, just show that.
      if (divisions.length === 1) {
        divisionDisplay = divisions[0]?.name;
      }
      // 2. divisionId directly on subject
      else if (subject.divisionId) {
        const division = divisions.find(div => div.id === subject.divisionId);
        if (division) {
          divisionDisplay = division.name;
        } else {
          // fallback: look for divisionId as string/number mismatch
          const fallbackDivision = divisions.find(div => String(div.id) === String(subject.divisionId));
          if (fallbackDivision) {
            divisionDisplay = fallbackDivision.name;
          }
        }
      }
      // 3. Array of divisionIds (multiple divisions)
      else if (Array.isArray(subject.divisionIds) && subject.divisionIds.length > 0) {
        const foundDivisions = divisions.filter(div => subject.divisionIds.map((id:any)=>String(id)).includes(String(div.id)));
        if (foundDivisions.length > 0) {
          divisionDisplay = foundDivisions.map((d: any) => d.name).join(", ");
        }
      }
      // 4. fallback: if multiple divisions, show all division names (common for theory subjects assigned to all divisions)
      else if (divisions.length > 1) {
        divisionDisplay = divisions.map(d => d.name).join(', ');
      }
      // If subjectClass exists and has at least one division, never show N/A
      if (divisionDisplay === "N/A" && divisions.length > 0) {
        divisionDisplay = divisions.map(d => d.name).join(', ');
      }
    } else if (type === 'practical') {
      if (subject.divisionId) {
        const division = divisions.find(div => div.id === subject.divisionId);
        if (division) {
          divisionDisplay = division.name;
        }
      } else if (subject.batchId) {
        let found = false;
        for (const division of divisions) {
          const batches = Array.isArray((division as any).batches) ? (division as any).batches : [];
          const batch = batches.find((b: any) => b.id === subject.batchId);
          if (batch) {
            divisionDisplay = `${division.name} (${batch.name})`;
            found = true;
            break;
          }
        }
        if (!found && subject.batch && subject.batch.name && subject.batch.divisionName) {
          divisionDisplay = `${subject.batch.divisionName} (${subject.batch.name})`;
        }
      } else if (divisions.length > 0) {
        divisionDisplay = divisions.map(d => d.name).join(', ');
      }
    }
  }

  return (
    <React.Fragment>
      <TableRow className="hover:bg-muted/50">
        <TableCell>
          <Button
            variant="ghost"
            className="w-full justify-start p-0 h-auto font-normal"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <div className="text-left">
                <div className="font-medium">{subject.name}</div>
              </div>
            </div>
          </Button>
        </TableCell>
        <TableCell>{subjectClass?.name || "N/A"}</TableCell>
        <TableCell>{divisionDisplay}</TableCell>
        <TableCell>
          <Badge variant={type === "theory" ? "default" : "secondary"}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={4} className="p-0">
            <SubjectSchedule lectureSlots={lectureSlots} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};
