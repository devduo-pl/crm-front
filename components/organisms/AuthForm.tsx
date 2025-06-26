import { LoginCard } from "@/components/molecules/LoginCard";

interface AuthFormProps {
  title: string;
  subtitle?: string;
}

export function AuthForm({ title, subtitle }: AuthFormProps) {
  return (
    <>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
      </div>

      {/* Login Card */}
      <LoginCard />
    </>
  );
}
