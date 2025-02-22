import { AtomicToggle } from "@/components/shared/atomic-toggle";
import { GreymassToggle } from "@/components/shared/greymass-toggle";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Label } from "@/components/ui/label";

export const SettingsPage = () => {
  return (
    <div className="mt-20 grid flex gap-5 justify-center">
      <div>
        <Label>Change Color Scheme</Label>
        <ModeToggle></ModeToggle>
      </div>
      <div>
        <Label>Change Atomic Assets Endpoint</Label>
        <AtomicToggle></AtomicToggle>
      </div>
      <div>
        <Label>Change API Endpoint</Label>
        <GreymassToggle></GreymassToggle>
      </div>
    </div>
  );
};
