"use client"

import * as React from "react"

import { useState } from "react";

// import icon
import { PlusCircle, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  FieldDescription,
} from "@/components/ui/field"

import type { Course } from "@/lib/types";

export default function AdminCoursesPage() {
  const {courses, removeInstructor, addCourse , removeCourse} = useEnrollmentStore();
  const [DialogOpen, setDialogOpen] = useState(false);
  const [formCourse, setFormCourse] = useState<string>("");
  const [formCourseCode, setFormCourseCode] = useState<string>("");
  const [formInstructor, setFormInstructor] = useState<string[]>([]);
  const [instructorQuery, setInstructorQuery] = useState("");

  const hasCourse = (courseCode: string) =>
    courses.some((c) => courseCode.trim().toLowerCase() === c.courseCode.toLowerCase());

  // เคลียร์ฟอร์มทุกครั้งที่ Dialog ปิด ไม่ว่าจะปิดเพราะลงทะเบียนสำเร็จ, กด X,
  // หรือคลิกนอก Dialog — เปิดครั้งหน้าจะได้เริ่มจากฟอร์มว่างเสมอ
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormCourseCode("");
      setFormCourse("");
      setFormInstructor([]);
      setInstructorQuery("");
    }
  };

  const handleSubmit = () => {
    const course: Course = {
      courseCode: formCourseCode,
      courseTitle: formCourse,
      instructors: formInstructor,
    };
    addCourse(course);
    handleDialogOpenChange(false);
  }

  const instructors = [...new Set(courses.flatMap((course) => course.instructors ?? []))];
  const newInstructor = instructorQuery.trim();
  const instructorExists = instructors.some(
    (instructor) => instructor.toLowerCase() === newInstructor.toLowerCase(),
  );
  const instructorOptions =
    newInstructor && !instructorExists
      ? [...instructors, newInstructor]
      : instructors;
  const anchor = useComboboxAnchor();


  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-semibold">จัดการวิชาเรียน</h1>
          <p className="text-sm text-muted-foreground">
            5 วิชา — เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
          </p>
        </div>
        <Dialog
          open={DialogOpen}
          onOpenChange={handleDialogOpenChange}
        >
          <DialogTrigger render={<Button />}>
            <PlusCircle className="h-4 w-4" />
            เพิ่มวิชา
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
              <DialogDescription>
                วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="formCourseCode">รหัสวิชา</Label>
                <Input
                  id="formCourseCode"
                  placeholder="เช่น CPE303"
                  onChange={(e) => setFormCourseCode(e.target.value)}
                  aria-invalid={hasCourse(formCourseCode)}
                  />
                  {hasCourse(formCourseCode) && 
                  <FieldDescription className="text-destructive">
                    มีรหัสวิชา {formCourseCode} นี้แล้ว
                  </FieldDescription>}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="formStudent">ชื่อวิชา</Label>
                <Input
                  id="formCourse"
                  placeholder="เช่น Mobile Application Development"
                  onChange={(e) => setFormCourse(e.target.value)}
                ></Input>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="formStudent">ผู้สอน</Label>
                <Combobox
                  multiple
                  autoHighlight
                  items={instructorOptions}
                  value={formInstructor}
                  onValueChange={setFormInstructor}
                  inputValue={instructorQuery}
                  onInputValueChange={setInstructorQuery}
                >
                  <ComboboxChips ref={anchor} className="w-full">
                    <ComboboxValue >
                      {(values) => (
                        <React.Fragment>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                            <ComboboxChipsInput
                              placeholder={values.length === 0 ? "เลือกหรือพิมพ์ชื่อผู้สอน(ได้หลายคน)" : ""}
                            />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>ไม่พบผู้สอน</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {instructors.includes(item)
                            ? item
                            : `+ เพิ่มผู้สอน "${item}"`}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>
            
            <DialogFooter>
              <Button
              disabled={!formCourseCode || !formCourse}
              onClick={handleSubmit}
              >
                <PlusCircle className="h-4 w-4" />
                ลงทะเบียน
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {(courses.length === 0) ?
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>

              : courses.map((c) => (
                <TableRow key={`${c.courseCode}`}>
                  <TableCell>{c.courseCode}</TableCell>
                  <TableCell>{c.courseTitle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                    {
                      (c.instructors?.length !== 0) ?
                        c.instructors?.map((i) =>
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                            {i}
                            <button
                              type="button"
                              onClick={() => removeInstructor(c, i)}
                              className="rounded hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                        : <p className="text-muted-foreground">ยังไม่มีผู้สอน</p>
                    }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => removeCourse(c)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
