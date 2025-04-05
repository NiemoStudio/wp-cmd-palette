import { Command } from 'cmdk';
import { useSearch } from '@/hooks/useSearch';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useCommandPaletteStore } from '@/utils/global';
import { useRef } from 'react';
import { CustomCaret } from './CustomCaret';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SearchResult } from '@/types';

export function CommandPalette() {
  const { close, isOpen } = useCommandPaletteStore();
  const { results } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const settings = window.wpCmdPalette.settings || {
    colors: {
      activeItem: 'gray',
      cursor: 'gray',
    },
    container: {
      opacity: 'Low',
      radius: 'Extra Large',
    },
    icon: {
      radius: 'Small',
    },
    overlay: {
      opacity: 'Low',
    },
  };

  useKeyboard({
    onOpen: () => useCommandPaletteStore.getState().open(),
    onClose: close,
  });

  return (
    <Command.Dialog open={isOpen}>
      <div
        data-cmdk-overlay-opacity={settings.overlay.opacity}
        data-cmdk-overlay
        onClick={close}
      />

      <div
        data-cmdk-container-opacity={settings.container.opacity}
        data-cmdk-container-radius={settings.container.radius}
        data-cmdk-container>
        <div data-cmdk-input-container>
          <Command.Input
            ref={inputRef}
            autoFocus={!isMobile}
            placeholder={`Search in ${window.wpCmdPalette?.siteName || 'WordPress'}...`}
          />

          {!isMobile && <CustomCaret color={settings.colors.cursor} inputRef={inputRef} />}

          <button
            data-cmdk-close-button
            onClick={close}
          >
            <i className="ri-close-line" data-cmdk-close-button-icon />
          </button>
        </div>

        <Command.List>
          {results && (
            <>
              {results.some((item: SearchResult) => item.pinned) && (
                <Command.Group heading="Pinned">
                  {results
                    .filter((item: SearchResult) => item.pinned)
                    .map((item: SearchResult) => (
                      <Command.Item
                        key={item.id}
                        data-cmdk-active-item-color={settings.colors.activeItem}
                        value={item.title}
                        onSelect={() => item.url && (window.location.href = item.url)}
                      >
                        <div
                          data-cmdk-item-color={item.color || 'gray'}
                          data-cmdk-item-icon-radius={settings.icon.radius}
                          data-cmdk-item-icon
                        >
                          <i className={`ri-${item.icon || 'pages-line'}`} />
                        </div>

                        {item.title}
                      </Command.Item>
                    ))}
                </Command.Group>
              )}

              <Command.Group heading="Pages">
                {results
                  .filter((item: SearchResult) => !item.pinned && !item.hidden)
                  .sort((a: SearchResult, b: SearchResult) => (a.order || 0) - (b.order || 0))
                  .map((item: SearchResult) => (
                    <Command.Item
                      key={item.id}
                      data-cmdk-active-item-color={settings.colors.activeItem}
                      value={item.title}
                      onSelect={() => item.url && (window.location.href = item.url)}
                    >
                      {item.type === 'page' && (
                        <div
                          data-cmdk-item-color={item.color || 'gray'}
                          data-cmdk-item-icon-radius={settings.icon.radius}
                          data-cmdk-item-icon
                        >
                          <i className={`ri-${item.icon || 'pages-line'}`} />
                        </div>
                      )}

                      {item.title}
                    </Command.Item>
                  ))}
              </Command.Group>
            </>
          )}

          <Command.Empty>
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM13.529 14.4464C11.9951 15.3524 9.98633 15.1464 8.66839 13.8284C7.1063 12.2663 7.1063 9.73367 8.66839 8.17157C10.2305 6.60948 12.7631 6.60948 14.3252 8.17157C15.6432 9.48951 15.8492 11.4983 14.9432 13.0322L17.1537 15.2426L15.7395 16.6569L13.529 14.4464ZM12.911 12.4142C13.6921 11.6332 13.6921 10.3668 12.911 9.58579C12.13 8.80474 10.8637 8.80474 10.0826 9.58579C9.30156 10.3668 9.30156 11.6332 10.0826 12.4142C10.8637 13.1953 12.13 13.1953 12.911 12.4142Z"></path></svg>
            <p>No results found</p>
          </Command.Empty>
        </Command.List>

        <div data-cmdk-footer>
          <div data-cmdk-footer-actions>
            <div data-cmdk-footer-action>
              <i className="ri-arrow-up-down-line" />
              <span>Select</span>
            </div>

            <div data-cmdk-footer-action>
              <i className="ri-corner-down-left-line" />
              <span>Open</span>
            </div>
          </div>

          <div data-cmdk-footer-action>
            <span data-cmdk-footer-action-key>⌘K</span>
            <span>Command Search</span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}
