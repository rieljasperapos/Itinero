import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const PasswordSection = ({
  isEditingPassword,
  setIsEditingPassword,
  setCurrentPassword,
  setNewPassword,
  setReTypePassword,
  handlePasswordSubmit,
}: {
  isEditingPassword: boolean;
  setIsEditingPassword: (value: boolean) => void;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setReTypePassword: (value: string) => void;
  handlePasswordSubmit: () => void;
}) => (
  <div className="border p-8 flex flex-col gap-8">
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-semibold">Security & Privacy</h1>
    </div>

    <div className="flex flex-col gap-6">
      {isEditingPassword ? (
        <>
          <PasswordField label="Current Password" onChange={setCurrentPassword} />
          <PasswordField label="New Password" onChange={setNewPassword} />
          <PasswordField label="Re-type Password" onChange={setReTypePassword} />
          <Button className="max-w-xs" onClick={handlePasswordSubmit}>
            Save Changes
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-2 text-slate-400">
          <span>Password</span>
          <div className="flex items-center gap-2">
            <span className="font-bold">******************</span>
            <Button
              variant="outline"
              onClick={() => setIsEditingPassword(true)}
            >
              Change Password
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>
);

const PasswordField = ({
  label,
  onChange,
}: {
  label: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-2 text-slate-400">
    <span>{label}</span>
    <Input
      type="password"
      placeholder={`Enter your ${label.toLowerCase()}`}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-xs"
    />
  </div>
);
