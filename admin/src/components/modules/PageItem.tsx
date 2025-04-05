import { Page, PageAction, ColorKey } from '@/types';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { IconName } from '@/lib/icons';

interface PageItemProps {
  action: PageAction;
  page: Page;
  onColorChange?: (color: ColorKey) => void;
  onIconChange?: (icon: IconName) => void;
  onVisibilityToggle?: () => void;
}

export default function PageItem({
  action,
  page,
  onColorChange,
  onIconChange,
  onVisibilityToggle
}: PageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(page.hidden ? {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        #f0f0f0,
        #f0f0f0 10px,
        #ffffff 10px,
        #ffffff 20px
      )`
    } : {})
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm shadow-black/2 ${page.hidden ? 'opacity-50' : ''}`}
      style={style}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            {...attributes}
            {...listeners}
            className="cursor-grab"
          >
            <i className="ri-expand-up-down-line text-gray-400 text-xl"></i>
          </Button>

          <ColorPicker
            value={page.color || ('gray' as ColorKey)}
            onChange={color => onColorChange?.(color)}
          />

          <IconPicker
            currentIcon={page.icon || 'pages-line'}
            onIconSelect={icon => onIconChange?.(icon)}
          />
        </div>

        <span className="font-medium text-base">{page.title}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={onVisibilityToggle}
        >
          <i className={`text-lg ri-${page.hidden ? 'eye-off-fill' : 'eye-fill'}`} />
        </Button>

        <Button
          disabled={action.disabled}
          size="icon"
          variant={action.variant === 'outline' ? 'ghost' : 'outline'}
          onClick={action.handleClick}
        >
          <i className={`text-lg ri-${action.label === 'Pin' ? 'pushpin-fill' : 'unpin-fill'}`} />
        </Button>
      </div>
    </div>
  );
} 
