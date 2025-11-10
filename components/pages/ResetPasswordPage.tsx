import { ResetPasswordCard } from "@/components/molecules/ResetPasswordCard";

interface ResetPasswordPageProps {
  token: string;
}

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below to complete the reset process.
        </p>
      </div>
      <ResetPasswordCard token={token} />
    </>
  );
}
