"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/hooks/useAuth";
import { apiService } from "@/lib/api-service";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PlusCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Validation schema
const jobFormSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.enum(["Remote", "Hybrid", "On-site"]),
  industry: z.string().min(1, "Industry is required"),
  salary: z.string().optional(),
  job_type: z.enum(["full-time", "part-time", "contract"]),
  deadline: z.string().refine((date) => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Deadline must be in the future"),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "employer")) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "Remote",
      industry: "",
      salary: "",
      job_type: "full-time",
      deadline: "",
    },
  });

  const onSubmit = async (values: JobFormValues) => {
    try {
      await apiService.jobs.postJob(values);
      router.push("/dashboard/jobs/manage");
    } catch (error) {
      console.error("Error creating job:", error);
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Failed to create job",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "employer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <DashboardHeader
          icon={<PlusCircle className="w-8 h-8 text-blue-600" />}
          title="Create New Job"
          subtitle="Post a new job opportunity"
          description="Fill in the details below to publish a new position."
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Senior React Developer"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The title of the job position
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the job responsibilities, requirements, and benefits..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the job
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Field */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Location *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Industry Field */}
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Technology, Finance, Healthcare"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The industry sector for this job
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Salary Field */}
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $50,000 - $80,000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave blank if salary is confidential
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Job Type Field */}
            <FormField
              control={form.control}
              name="job_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deadline Field */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Deadline *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    When should applications close?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1"
              >
                {form.formState.isSubmitting ? "Posting..." : "Post Job"}
              </Button>
            </div>

            {/* Error Message */}
            {form.formState.errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                {form.formState.errors.root.message}
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
