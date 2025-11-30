"use client";

import FileUploadDropzone from "@/components/fileUploader";
import { Button } from "@/components/ui/button/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useDebounce } from "@/hooks/useDebounce";
import { PaperSchema, paperSchema } from "@/schemas/paper.schema";
import {
  useFetchGradeByIdQuery,
  useFetchGradesQuery,
} from "@/store/api/splits/grades";
import { useUpdatePaperMutation } from "@/store/api/splits/papers";
import { getErrorInApiResult } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface EditPaperProps {
  id: string;
  title: string;
  description: string;
  grade: string | { id: string; title: string };
  subject: string | { id: string; title: string };
  year: string;
  url: string;
}

interface Subject {
  id: string;
  title: string;
}

export function EditPaper({
  id,
  title,
  description,
  grade,
  subject,
  year,
  url,
}: EditPaperProps) {
  const [open, setOpen] = useState(false);
  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && initialValues) {
      // discard changes and restore original values
      reset(initialValues);
      setSubjectSearch("");
      setSelectedGradeId(initialValues.grade || null);
      setPreviewUrl(initialValues.url || null);
    }
  };

  const handleCancel = () => {
    if (initialValues) {
      reset(initialValues);
      setSubjectSearch("");
      setSelectedGradeId(initialValues.grade || null);
      setPreviewUrl(initialValues.url || null);
    }
    setOpen(false);
  };

  // Extract IDs
  const gradeId = typeof grade === "string" ? grade : grade.id;
  const subjectId = typeof subject === "string" ? subject : subject.id;
  const [hydrated, setHydrated] = useState(false);

  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(
    gradeId,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(url || null);

  // 🔍 Grade search
  const [gradeSearch, setGradeSearch] = useState("");
  const debouncedGradeSearch = useDebounce(gradeSearch, 300);

  // 🔍 Subject search (local)
  const [subjectSearch, setSubjectSearch] = useState("");

  const updatePaperForm = useForm<PaperSchema>({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      title: "",
      description: "",
      grade: "",
      subject: "",
      year: "",
      url: "",
    },
    mode: "onChange",
  });

  const [updatePaper, { isLoading }] = useUpdatePaperMutation();

  // Load grades with search
  const { data: gradeData, isLoading: isGradesLoading } = useFetchGradesQuery({
    title: debouncedGradeSearch,
  });

  const { data: gradeDetails, isLoading: isGradeDetailsLoading } =
    useFetchGradeByIdQuery(selectedGradeId!, { skip: !selectedGradeId });

  const { formState, watch, setValue, register, reset, getValues } =
    updatePaperForm;

  const { isDirty } = formState;

  const selectedGrade = watch("grade");
  const [initialValues, setInitialValues] = useState<PaperSchema | null>(null);

  useEffect(() => {
    if (open && gradeDetails) {
      const subjectExists = gradeDetails.subjects?.some(
        (s: Subject) => s.id === subjectId,
      );

      const values: PaperSchema = {
        title,
        description,
        grade: gradeId,
        subject: subjectExists ? subjectId : "",
        year,
        url,
      };

      // reset form and save original snapshot
      reset(values);
      setInitialValues(values);

      setSubjectSearch("");
      setHydrated(true);
    }
  }, [
    open,
    gradeDetails,
    title,
    description,
    gradeId,
    subjectId,
    year,
    url,
    reset,
  ]);
  useEffect(() => {
    if (open && gradeDetails) {
      const subjectExists = gradeDetails.subjects?.some(
        (s: Subject) => s.id === subjectId,
      );

      updatePaperForm.reset({
        title,
        description,
        grade: gradeId,
        subject: subjectExists ? subjectId : "",
        year,
        url,
      });

      setSubjectSearch("");
      setHydrated(true);
    }
  }, [open, gradeDetails, title, description, gradeId, subjectId, year, url]);

  useEffect(() => {
    if (selectedGrade && selectedGrade !== gradeId) {
      setValue("subject", "");
      setSelectedGradeId(selectedGrade);
      setSubjectSearch("");
    }
  }, [selectedGrade, gradeId, setValue]);

  const filteredSubjects =
    gradeDetails?.subjects?.filter((sub: Subject) =>
      sub.title.toLowerCase().includes(subjectSearch.toLowerCase()),
    ) ?? [];

  const onSubmit = async (data: PaperSchema) => {
    try {
      const result = await updatePaper({ id, ...data });
      const error = getErrorInApiResult(result);

      if (error) return toast.error(error);

      if ("data" in result) {
        toast.success("Paper updated successfully");

        const updatedValues = getValues();
        setInitialValues(updatedValues);
        reset(updatedValues);

        setOpen(false);
      }
    } catch (error) {
      console.error("Unexpected error during paper update:", error);
      toast.error("An unexpected error occurred while updating the paper.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <SquarePen className="cursor-pointer text-blue-500 hover:text-blue-700" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white z-50 dark:bg-gray-800 dark:text-white/90">
        <form onSubmit={updatePaperForm.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Paper</DialogTitle>
            <DialogDescription>Edit the paper details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 max-h-[67vh] overflow-y-auto">
            {/* TITLE */}
            <div className="grid gap-3">
              <Label>Title</Label>
              <Input {...register("title")} />
              {formState.errors.title && (
                <p className="text-sm text-red-500">
                  {formState.errors.title.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="grid gap-3">
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                rows={1}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = t.scrollHeight + "px";
                }}
                className="resize-none overflow-hidden"
              />
              {formState.errors.description && (
                <p className="text-sm text-red-500">
                  {formState.errors.description.message}
                </p>
              )}
            </div>

            {/* GRADE DROPDOWN */}
            <div className="grid gap-3">
              <Label>Grade</Label>
              <Select
                onValueChange={(value) => setValue("grade", value)}
                value={hydrated ? watch("grade") : undefined}
                disabled={isGradesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>

                <SelectContent className="w-full">
                  {/* 🔍 Grade search bar */}
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search grade..."
                      value={gradeSearch}
                      onChange={(e) => setGradeSearch(e.target.value)}
                      className="h-8"
                    />
                  </div>

                  <SelectGroup>
                    <SelectLabel>Grades</SelectLabel>

                    {gradeData?.results?.length === 0 && (
                      <div className="p-3 text-sm text-gray-500">
                        No results found.
                      </div>
                    )}

                    {gradeData?.results?.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {formState.errors.grade && (
                <p className="text-sm text-red-500">
                  {formState.errors.grade.message}
                </p>
              )}
            </div>

            {/* SUBJECT DROPDOWN */}
            <div className="grid gap-3">
              <Label>Subject</Label>
              <Select
                onValueChange={(value) => setValue("subject", value)}
                value={hydrated ? watch("subject") : undefined}
                disabled={!selectedGradeId || isGradeDetailsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>

                <SelectContent className="w-full">
                  {/* 🔍 Subject search bar */}
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Search subject..."
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      className="h-8"
                    />
                  </div>

                  <SelectGroup>
                    <SelectLabel>Subjects</SelectLabel>

                    {filteredSubjects.length === 0 && (
                      <div className="p-3 text-sm text-gray-500">
                        No results found.
                      </div>
                    )}

                    {filteredSubjects.map((sub: Subject) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {formState.errors.subject && (
                <p className="text-sm text-red-500">
                  {formState.errors.subject.message}
                </p>
              )}
            </div>

            {/* YEAR */}
            <div className="grid gap-3">
              <Label>Year</Label>
              <Input type="text" {...register("year")} />
              {formState.errors.year && (
                <p className="text-sm text-red-500">
                  {formState.errors.year.message}
                </p>
              )}
            </div>

            {/* FILE UPLOAD */}
            <div className="grid gap-3">
              <Label>Paper File</Label>
              <FileUploadDropzone
                onUploaded={(uploadedUrl) => {
                  setValue("url", uploadedUrl);
                  setPreviewUrl(uploadedUrl);
                }}
              />
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline mt-2"
                >
                  View Uploaded File
                </a>
              )}
              {formState.errors.url && (
                <p className="text-sm text-red-500">
                  {formState.errors.url.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-500"
              isLoading={isLoading}
              disabled={!isDirty}
              onClick={updatePaperForm.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
