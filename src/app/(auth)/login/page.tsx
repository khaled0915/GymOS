import { AuthSwitch } from "@/components/auth/auth-switch";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center p-4 relative selection:bg-emerald-500 selection:text-black">
      <AuthSwitch initialMode="signin" />
    </div>
  );
}
