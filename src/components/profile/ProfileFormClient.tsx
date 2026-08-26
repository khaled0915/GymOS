"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateProfileAction, deleteAccountAction } from "@/actions/profile.actions";
import { User, Save, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const FITNESS_GOALS = [
  { value: "MUSCLE_GAIN", label: "Muscle Gain" },
  { value: "FAT_LOSS", label: "Fat Loss" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "STRENGTH", label: "Strength" },
  { value: "GENERAL_FITNESS", label: "General Fitness" },
] as const;

const EXPERIENCE_LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
] as const;

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    height?: number;
    currentWeight?: number;
    fitnessGoal?: string;
    experienceLevel?: string;
    preferredUnit?: string;
    weeklyFrequency?: number;
  };
}

export function ProfileFormClient({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [name, setName] = useState(initialData.name);
  const [height, setHeight] = useState(initialData.height?.toString() || "");
  const [currentWeight, setCurrentWeight] = useState(initialData.currentWeight?.toString() || "");
  const [fitnessGoal, setFitnessGoal] = useState(initialData.fitnessGoal || "");
  const [experienceLevel, setExperienceLevel] = useState(initialData.experienceLevel || "");
  const [preferredUnit, setPreferredUnit] = useState(initialData.preferredUnit || "METRIC");
  const [weeklyFrequency, setWeeklyFrequency] = useState(initialData.weeklyFrequency?.toString() || "");

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await updateProfileAction({
        name: name || undefined,
        height: height ? parseFloat(height) : undefined,
        currentWeight: currentWeight ? parseFloat(currentWeight) : undefined,
        fitnessGoal: fitnessGoal ? (fitnessGoal as any) : undefined,
        experienceLevel: experienceLevel ? (experienceLevel as any) : undefined,
        preferredUnit: preferredUnit ? (preferredUnit as any) : undefined,
        weeklyFrequency: weeklyFrequency ? parseInt(weeklyFrequency) : undefined,
      });
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.error || "Failed to update profile.");
      }
    });
  };

  const handleDeleteAccount = () => {
    startTransition(async () => {
      await deleteAccountAction();
      window.location.href = "/login";
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" /> Account Information
          </CardTitle>
          <CardDescription>Your personal profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input disabled value={initialData.email} />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
        </CardContent>
      </Card>

      {/* Physical Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Physical Metrics</CardTitle>
          <CardDescription>Body measurements for progress tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
              />
            </div>
            <div className="space-y-2">
              <Label>Current Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="75"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Unit Preference</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={preferredUnit === "METRIC" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreferredUnit("METRIC")}
              >
                Metric (kg/cm)
              </Button>
              <Button
                type="button"
                variant={preferredUnit === "IMPERIAL" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreferredUnit("IMPERIAL")}
              >
                Imperial (lbs/in)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training Preferences</CardTitle>
          <CardDescription>Customize your training experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fitness Goal</Label>
            <select
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
            >
              <option value="">Select a goal</option>
              {FITNESS_GOALS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Experience Level</Label>
            <div className="flex gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <Button
                  key={level.value}
                  type="button"
                  variant={experienceLevel === level.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExperienceLevel(level.value)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Weekly Training Frequency</Label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={weeklyFrequency === d.toString() ? "default" : "outline"}
                  size="sm"
                  className="w-9 h-9 p-0"
                  onClick={() => setWeeklyFrequency(d.toString())}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} variant="athletic" size="lg" disabled={isPending}>
          {isPending ? (
            "Saving…"
          ) : saved ? (
            <><Check className="mr-2 h-4 w-4" /> Saved!</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Save Profile</>
          )}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && <Badge variant="success">Profile updated successfully</Badge>}
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {showDeleteConfirm ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive font-medium">
                Are you sure? This action cannot be undone. All your workouts, programs, and progress data will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isPending}
                >
                  {isPending ? "Deleting\u2026" : "Yes, Delete My Account"}
                </Button>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
