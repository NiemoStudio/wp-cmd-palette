import { useSettings } from "@/hooks/useSettings";
import { SettingsCard } from "@/components/modules/SettingsCard";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Settings = () => {
  const { resetToDefault } = useSettings();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <SettingsCard
          description="Reset all settings to their default values. This action cannot be undone."
          title="Factory Reset"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Reset to Default
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="m-0!">Are you sure?</AlertDialogTitle>

                <AlertDialogDescription className="mb-0!">
                  This action will reset all settings and styling to their default values.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction onClick={() => resetToDefault()}>
                  Reset to Default
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingsCard>
      </div>
    </div>
  );
};

export default Settings;
