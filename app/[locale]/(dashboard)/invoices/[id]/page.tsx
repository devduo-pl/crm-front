"use client";

import { InvoiceViewPage } from "@/components/pages/InvoiceViewPage";
import { useParams } from "next/navigation";

export default function InvoiceView() {
  const params = useParams();
  const invoiceId = params.id as string;

  return <InvoiceViewPage invoiceId={invoiceId} />;
}

