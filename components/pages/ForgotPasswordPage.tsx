import { ForgotPasswordCard } from "@/components/molecules/ForgotPasswordCard";

export function ForgotPasswordPage() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>
      <ForgotPasswordCard />
    </>
  );
} 