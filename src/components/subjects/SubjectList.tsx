
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubjectRow } from './SubjectRow';
import { EmptyMessage } from './EmptyMessage';
import { BookOpen, FlaskConical } from 'lucide-react';

interface SubjectListProps {
  subjects: any[];
  type: 'theory' | 'practical';
}

export const SubjectList: React.FC<SubjectListProps> = ({ subjects, type }) => {
  if (subjects.length === 0) {
    return (
      <EmptyMessage 
        icon={type === 'theory' ? BookOpen : FlaskConical}
        title={type === 'theory' ? "No theory subjects assigned" : "No practicals assigned"}
      />
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Division</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <SubjectRow key={subject.id} subject={subject} type={type} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
