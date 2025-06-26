
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type ClassType = { name: string; id: string; divisions: { id: string; name: string }[] };
type DivisionType = { id: string; name: string };

interface Props {
  classNames: { name: string }[];
  selectedClassName: string;
  setSelectedClassName: (name: string) => void;
  divisions: DivisionType[];
  selectedDivision: string;
  setSelectedDivision: (id: string) => void;
}

const ClassDivisionSelector: React.FC<Props> = ({
  classNames,
  selectedClassName,
  setSelectedClassName,
  divisions,
  selectedDivision,
  setSelectedDivision,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Class & Division</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Class</Label>
            <Select
              value={selectedClassName}
              onValueChange={setSelectedClassName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classNames.map((cls) => (
                  <SelectItem key={cls.name} value={cls.name}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Division</Label>
            <Select
              value={selectedDivision}
              onValueChange={setSelectedDivision}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((div) => (
                  <SelectItem key={div.id} value={div.id}>
                    {div.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassDivisionSelector;
