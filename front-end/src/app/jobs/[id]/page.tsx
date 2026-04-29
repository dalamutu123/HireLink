"use client";

import { useParams } from "next/navigation";

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Job Details</h1>
      <p>Viewing details for job ID: {id}</p>
    </div>
  );
}
