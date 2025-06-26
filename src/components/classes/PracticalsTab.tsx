import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, Plus } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface PracticalsTabProps {
  classId: string;
}

const PracticalsTab = ({ classId }: PracticalsTabProps) => {
  const [newPracticalName, setNewPracticalName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPractical, setEditingPractical] = useState<{
    id: string;
    name: string;
    teacherEmail?: string;
  } | null>(null);
  
  const { toast } = useToast();
  const { 
    addPractical, 
    getPracticalsForClass, 
    deletePractical, 
    assignTeacherToPractical,
    updatePractical,
    existingUsers,
    getClassNameById,
    getUserDepartment,
    classes
  } = useUser();

  const practicals = getPracticalsForClass(classId);
  const currentDepartment = getUserDepartment();
  
  // Show only faculty members and HOD from the current department
  const facultyList = existingUsers.filter(user => 
    (user.role === "faculty" || user.role === "hod") && 
    user.department === currentDepartment && 
    !user.isBlocked
  );
  const className = getClassNameById(classId);

  // Use classes directly here, no need to redeclare!
  const classData = classes.find(cls => cls.id === classId);
  const divisions = classData?.divisions || [];

  // Utility to get division/batch label for a practical (mirroring new SubjectRow theory/practical logic)
  function getDivisionDisplay(practical: any) {
    // Has direct divisionId - show that division
    if (practical.divisionId) {
      const div = divisions.find((d: any) => String(d.id) === String(practical.divisionId));
      if (div) return div.name;
    }
    // Has batchId - find batch and its division
    if (practical.batchId) {
      for (const div of divisions) {
        const batches = Array.isArray((div as any).batches) ? (div as any).batches : [];
        const batch = batches.find((b: any) => String(b.id) === String(practical.batchId));
        if (batch) return `${div.name} (${batch.name})`;
      }
      // fallback if batch provided as object on practical
      if (practical.batch && practical.batch.name && practical.batch.divisionName)
        return `${practical.batch.divisionName} (${practical.batch.name})`;
    }
    // Array of divisionIds
    if (Array.isArray(practical.divisionIds) && practical.divisionIds.length > 0) {
      const divList = divisions.filter(div => practical.divisionIds.map((id:any)=>String(id)).includes(String(div.id)));
      if (divList.length > 0)
        return divList.map((d: any) => d.name).join(", ");
    }
    // Fallback: list all division names if present
    if (divisions.length > 0) {
      return divisions.map(d => d.name).join(", ");
    }
    return "N/A";
  }

  const handleAddPractical = () => {
    if (!newPracticalName.trim()) {
      toast({
        title: "Error",
        description: "Practical name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check if practical already exists for this class
    if (practicals.some(practical => practical.name.toLowerCase() === newPracticalName.toLowerCase())) {
      toast({
        title: "Error",
        description: "This practical already exists for this class",
        variant: "destructive",
      });
      return;
    }

    // Add the practical
    const practicalId = addPractical({
      name: newPracticalName,
      classId,
      teacherEmail: selectedTeacher === "none" ? undefined : selectedTeacher || undefined
    });

    if (practicalId) {
      toast({
        title: "Success",
        description: "Practical added successfully",
      });
      setNewPracticalName("");
      setSelectedTeacher("");
    }
  };

  const handleDeletePractical = (practicalId: string) => {
    const success = deletePractical(practicalId);

    if (success) {
      toast({
        title: "Practical Deleted",
        description: "The practical has been removed successfully",
        variant: "destructive",
      });
    }
  };

  const handleEditPractical = () => {
    if (!editingPractical) return;
    
    if (!editingPractical.name.trim()) {
      toast({
        title: "Error",
        description: "Practical name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Update practical name
    const success = updatePractical(editingPractical.id, {
      name: editingPractical.name,
      teacherEmail: editingPractical.teacherEmail === "none" ? undefined : editingPractical.teacherEmail
    });

    if (success) {
      toast({
        title: "Practical Updated",
        description: "Practical has been updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingPractical(null);
    }
  };

  const openEditDialog = (practical: {
    id: string;
    name: string;
    teacherEmail?: string;
  }) => {
    setEditingPractical({
      id: practical.id,
      name: practical.name,
      teacherEmail: practical.teacherEmail || "none"
    });
    setIsEditDialogOpen(true);
  };

  const getTeacherName = (email?: string) => {
    if (!email) return "Not assigned";
    const teacher = existingUsers.find(user => user.email === email);
    return teacher ? teacher.name : "Unknown";
  };

  const getTeacherDisplayName = (teacher: any) => {
    if (teacher.role === "hod") {
      return `${teacher.name} (HOD)`;
    }
    return teacher.name;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Practicals for {className}</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Practical
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Practical</DialogTitle>
              <DialogDescription>
                Enter the details of the new practical.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Practical Name
                </label>
                <Input 
                  id="name" 
                  className="col-span-3" 
                  value={newPracticalName}
                  onChange={(e) => setNewPracticalName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="teacher" className="text-right">
                  Assigned Teacher
                </label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger id="teacher" className="col-span-3">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {facultyList.map((faculty) => (
                      <SelectItem key={faculty.email} value={faculty.email}>
                        {getTeacherDisplayName(faculty)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setNewPracticalName("");
                setSelectedTeacher("");
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddPractical}>Add Practical</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Practical Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Practical</DialogTitle>
            <DialogDescription>
              Modify the practical details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Practical Name
              </label>
              <Input 
                id="edit-name" 
                className="col-span-3" 
                value={editingPractical?.name || ""}
                onChange={(e) => setEditingPractical(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-teacher" className="text-right">
                Assigned Teacher
              </label>
              <Select 
                value={editingPractical?.teacherEmail || "none"} 
                onValueChange={(value) => setEditingPractical(prev => prev ? {...prev, teacherEmail: value} : null)}
              >
                <SelectTrigger id="edit-teacher" className="col-span-3">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {facultyList.map((faculty) => (
                    <SelectItem key={faculty.email} value={faculty.email}>
                      {getTeacherDisplayName(faculty)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditPractical}>Update Practical</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {practicals.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Practical Name</TableHead>
              <TableHead>Assigned Teacher</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {practicals.map((practical) => (
              <TableRow key={practical.id}>
                <TableCell>{practical.name}</TableCell>
                <TableCell>{getTeacherName(practical.teacherEmail)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => openEditDialog(practical)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePractical(practical.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 bg-muted/40 rounded-lg">
          <p className="text-muted-foreground">No practicals found for this class.</p>
          <p className="text-sm text-muted-foreground mt-1">Add practicals using the "Add Practical" button.</p>
        </div>
      )}
    </div>
  );
};

export default PracticalsTab;
