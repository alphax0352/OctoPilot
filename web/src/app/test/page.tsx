"use client";

import { MonthPicker } from "@/components/ui/month-picker";
import { useState } from "react";

export default function TestPage() {
  const [month, setMonth] = useState<Date | null>(null);
  return (
    <div>
      <MonthPicker
        currentMonth={month}
        onMonthChange={(value) => setMonth(value)}
      />
    </div>
  );
}
