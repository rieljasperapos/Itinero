import { Avatar, AvatarImage, AvatarFallback } from "@/components/avatar";

export const AvatarSection = ({ name, username }: { name: string | undefined; username: string | undefined }) => (
  <div className="justify-center p-4 flex flex-col items-center gap-3">
    <Avatar className="h-36 w-36 rounded-full">
      <AvatarImage src="/avatars/shadcn.jpg" alt={name} />
      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
    </Avatar>
    <div className="flex flex-col items-center">
      <p className="text-2xl font-semibold">{name}</p>
      <p className="text-lg">{username}</p>
    </div>
  </div>
);
