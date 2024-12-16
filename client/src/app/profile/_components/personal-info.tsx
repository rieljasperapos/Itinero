import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Edit2, Check } from "lucide-react";

export const PersonalInfoSection = ({
  isEditingInfo,
  name,
  email,
  setIsEditingInfo,
  setNewName,
  setNewEmail,
  handleInfoSubmit,
}: {
  isEditingInfo: boolean;
  name: string | undefined;
  email: string | undefined;
  setIsEditingInfo: (value: boolean) => void;
  setNewName: (value: string) => void;
  setNewEmail: (value: string) => void;
  handleInfoSubmit: () => void;
}) => (
  <div className="border p-8 flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-semibold">Personal Information</h1>
      {isEditingInfo ? (
        <Button className="flex items-center gap-2" onClick={handleInfoSubmit}>
          <Check className="w-4 h-4" />
          Save Changes
        </Button>
      ) : (
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsEditingInfo(true)}
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>
      )}
    </div>

    <div className="flex flex-col gap-6">
      {isEditingInfo ? (
        <>
          <EditableField label="Name" value={name as string} onChange={setNewName} />
          <EditableField label="Email address" value={email as string} onChange={setNewEmail} />
        </>
      ) : (
        <>
          <ReadOnlyField label="Name" value={name as string} />
          <ReadOnlyField label="Email address" value={email as string} />
        </>
      )}
    </div>
  </div>
);

const EditableField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-2 text-slate-400">
    <span>{label}</span>
    <Input
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-xs"
    />
  </div>
);

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-2 text-slate-400 text-md">
    <span>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);
