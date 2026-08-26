"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logWeightAction } from "@/actions/progress.actions";
import { Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function WeightLogFormClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLog = () => {
    if (!value) return;
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await logWeightAction({ value: parseFloat(value), unit });
      if (res.success) {
        setSaved(true);
        setValue("");
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      } else {
        setError(res.error || "Failed to log weight.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Plus className="h-5 w-5 text-emerald-600" /> Log Body Weight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Weight</label>
            <Input
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={unit === "kg" ? "75.0" : "165.0"}
              className="text-center font-bold text-lg"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Unit</label>
            <div className="flex gap-1">
              <Button
                type="button"
                variant={unit === "kg" ? "default" : "outline"}
                size="sm"
                onClick={() => setUnit("kg")}
              >
                kg
              </Button>
              <Button
                type="button"
                variant={unit === "lbs" ? "default" : "outline"}
                size="sm"
                onClick={() => setUnit("lbs")}
              >
                lbs
              </Button>
            </div>
          </div>
          <Button
            onClick={handleLog}
            variant="athletic"
            disabled={isPending || !value}
          >
            {isPending ? "Logging…" : saved ? <><Check className="mr-1 h-4 w-4" /> Saved</> : "Log Weight"}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        {saved && <Badge variant="success" className="mt-2">Weight logged successfully</Badge>}
      </CardContent>
    </Card>
  );
}
