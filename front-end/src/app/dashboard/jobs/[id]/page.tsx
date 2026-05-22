"use client";

import { useParams } from "next/navigation";

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Job details & how to apply</h1>
      <p className="text-sm text-slate-600">Viewing details for job ID: {id}</p>
    </div>
  );
}
