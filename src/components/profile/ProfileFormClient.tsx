"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  updateProfileAction,
  deleteAccountAction,
  exportUserDataAction,
  exportWorkoutsCsvAction,
} from "@/actions/profile.actions";
import { Save, Check, Download, FileSpreadsheet, FileJson } from "lucide-react";
import type { FitnessGoal, ExperienceLevel, UnitPreference } from "@prisma/client";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    dateOfBirth: string | null;
    height: number | null;
    currentWeight: number | null;
    fitnessGoal: FitnessGoal | null;
    experienceLevel: ExperienceLevel | null;
    preferredUnit: UnitPreference;
    weeklyFrequency: number | null;
  };
}

const FITNESS_GOALS: { value: FitnessGoal; label: string }[] = [
  { value: "MUSCLE_GAIN", label: "Muscle Gain" },
  { value: "FAT_LOSS", label: "Fat Loss" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "STRENGTH", label: "Strength" },
  { value: "GENERAL_FITNESS", label: "General Fitness" },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "BEGINNER", label: "Beginner (< 1 year)" },
  { value: "INTERMEDIATE", label: "Intermediate (1–3 years)" },
  { value: "ADVANCED", label: "Advanced (3+ years)" },
];

export function ProfileFormClient({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(initialData.name);
  const [dateOfBirth, setDateOfBirth] = useState(initialData.dateOfBirth ?? "");
  const [height, setHeight] = useState(initialData.height?.toString() ?? "");
  const [currentWeight, setCurrentWeight] = useState(initialData.currentWeight?.toString() ?? "");
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal | "">(initialData.fitnessGoal ?? "");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">(initialData.experienceLevel ?? "");
  const [preferredUnit, setPreferredUnit] = useState<UnitPreference>(initialData.preferredUnit);
  const [weeklyFrequency, setWeeklyFrequency] = useState(initialData.weeklyFrequency?.toString() ?? "4");

  // Danger zone state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    setError(null);
    setSaved(false);

    startTransition(async () => {
      const res = await updateProfileAction({
        name: name || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        height: height ? parseFloat(height) : undefined,
        currentWeight: currentWeight ? parseFloat(currentWeight) : undefined,
        fitnessGoal: fitnessGoal || undefined,
        experienceLevel: experienceLevel || undefined,
        preferredUnit,
        weeklyFrequency: weeklyFrequency ? parseInt(weeklyFrequency) : undefined,
      });

      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.error ?? "Failed to update profile.");
      }
    });
  };

  const handleDeleteAccount = () => {
    startTransition(async () => {
      await deleteAccountAction();
      window.location.href = "/login";
    });
  };

  const handleExportJson = async () => {
    startTransition(async () => {
      const res = await exportUserDataAction();
      if (res.success && res.data) {
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gymos-backup-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleExportCsv = async () => {
    startTransition(async () => {
      const res = await exportWorkoutsCsvAction();
      if (res.success && res.csv) {
        const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gymos-workouts-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
          <CardDescription>Your personal details and identification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Display Name</Label>
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
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Physical Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Physical Metrics</CardTitle>
          <CardDescription>Body measurements for progress tracking & nutrition calculation</CardDescription>
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
              onChange={(e) => setFitnessGoal(e.target.value as FitnessGoal)}
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
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
            >
              <option value="">Select your experience</option>
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Weekly Target Frequency (Days per week)</Label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant={weeklyFrequency === num.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setWeeklyFrequency(num.toString())}
                >
                  {num} Days
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

      {/* Data Portability & Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-emerald-600" /> Data Portability & Backup
          </CardTitle>
          <CardDescription>Export and backup your complete fitness and nutrition data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            disabled={isPending}
            className="flex-1"
          >
            <FileJson className="mr-2 h-4 w-4 text-blue-500" /> Export Full Backup (JSON)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={isPending}
            className="flex-1"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-500" /> Export Workouts (CSV)
          </Button>
        </CardContent>
      </Card>

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
                  {isPending ? "Deleting…" : "Yes, Delete My Account"}
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
