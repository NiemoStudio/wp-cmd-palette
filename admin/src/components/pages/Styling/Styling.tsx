import { useStyling } from '@/hooks/useStyling';
import { StylingSettings } from '@/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from '@/components/modules/ColorPicker';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { SettingsCard } from '@/components/modules/SettingsCard';

const Styling = () => {
  const { isLoading, settings, updateSettings } = useStyling();

  const handleUpdate = (newSettings: Partial<StylingSettings>) => {
    if (!settings) return;

    updateSettings(
      { ...settings, ...newSettings },
      {
        onSuccess: () => {
          toast.success('Settings updated successfully');
        },
      }
    );
  };

  if (isLoading || !settings) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] bg-neutral-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <SettingsCard
          description="Choose the colors for active items and cursor"
          title="Colors"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Active Item Color</Label>

              <ColorPicker
                value={settings.colors.activeItem}
                onChange={(color) => handleUpdate({ colors: { ...settings.colors, activeItem: color } })}
              />
            </div>

            <div className="space-y-2">
              <Label>Cursor Color</Label>

              <ColorPicker
                value={settings.colors.cursor}
                onChange={(color) => handleUpdate({ colors: { ...settings.colors, cursor: color } })}
              />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          description="Adjust the container appearance"
          title="Container"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Opacity</Label>

              <Select
                value={settings.container.opacity}
                onValueChange={(value) => handleUpdate({ container: { ...settings.container, opacity: value as "Low" | "Medium" | "None" } })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Border Radius</Label>

              <Select
                value={settings.container.radius}
                onValueChange={(value) => handleUpdate({ container: { ...settings.container, radius: value as "Small" | "Medium" | "Large" | "Extra Large" } })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                  <SelectItem value="Extra Large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          description="Customize the appearance of icons"
          title="Icons"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Border Radius</Label>

              <Select
                value={settings.icon.radius}
                onValueChange={(value) => handleUpdate({ icon: { ...settings.icon, radius: value as "Small" | "Medium" | "Circle" } })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Circle">Circle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          description="Adjust the overlay appearance"
          title="Overlay"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Opacity</Label>

              <Select
                value={settings.overlay.opacity}
                onValueChange={(value) => handleUpdate({ overlay: { ...settings.overlay, opacity: value as "Low" | "Medium" | "High" | "None" } })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default Styling;
