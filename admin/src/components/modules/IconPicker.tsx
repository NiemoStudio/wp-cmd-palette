import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useState } from 'react';
import { Command } from 'cmdk';
import { icons, IconName } from '@/lib/icons';
import { Button } from '@/components/ui/button';

interface IconPickerProps {
  currentIcon: IconName;
  onIconSelect: (icon: IconName) => void;
}

export function IconPicker({ currentIcon, onIconSelect }: IconPickerProps) {
  const [search, setSearch] = useState('');

  const filteredIcons = icons.filter(icon =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
        >
          <i className={`ri-${currentIcon} text-xl`} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-0">
        <Command>
          <div className="p-2 -mb-2">
            <input
              className="w-full px-2! py-1! border! border-gray-300! rounded-md focus:border-blue-500! focus:ring-2! focus:ring-blue-500/20"
              placeholder="Search icons..."
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Command.List className="max-h-64 overflow-auto p-2">
            <div className="grid grid-cols-3 gap-2">
              {filteredIcons.map(icon => (
                <Command.Item
                  key={icon}
                  className="flex flex-col items-center justify-center gap-1 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onSelect={() => onIconSelect(icon)}
                >
                  <i className={`ri-${icon} text-xl`} />
                  <span className="text-xs text-center truncate w-full">{icon}</span>
                </Command.Item>
              ))}
            </div>
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
