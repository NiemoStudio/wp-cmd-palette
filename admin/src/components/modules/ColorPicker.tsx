import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const colors = [
  { className: 'bg-gray-500', label: 'Gray', value: 'gray' },
  { className: 'bg-blue-500', label: 'Blue', value: 'blue' },
  { className: 'bg-green-500', label: 'Green', value: 'green' },
  { className: 'bg-yellow-500', label: 'Yellow', value: 'yellow' },
  { className: 'bg-red-500', label: 'Red', value: 'red' },
  { className: 'bg-purple-500', label: 'Purple', value: 'purple' },
  { className: 'bg-orange-500', label: 'Orange', value: 'orange' },
  { className: 'bg-pink-500', label: 'Pink', value: 'pink' },
] as const;

type Color = typeof colors[number]['value'];

interface ColorPickerProps {
  value: Color;
  onChange: (color: Color) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
        >
          <div
            className={cn(
              'size-6 rounded-sm',
              colors.find((color) => color.value === value)?.className
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[138px] p-0">
        <div className="grid grid-cols-4 gap-2 p-2">
          {colors.map((color) => (
            <button
              key={color.value}
              className={cn(
                'size-6 rounded-sm transition-colors hover:opacity-80',
                color.className,
                value === color.value && 'ring-2 ring-offset-2 ring-offset-background ring-ring'
              )}
              onClick={() => onChange(color.value)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
