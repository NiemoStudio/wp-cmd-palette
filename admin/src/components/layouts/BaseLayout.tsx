import { Outlet, NavLink, useLocation } from "react-router";
import { useEffect } from "react";

export const BaseLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <nav className="flex items-center gap-x-14 bg-neutral-800 text-white p-4 sticky top-[32px] z-50">
        <div>
          <p className="text-sm! tracking-tight font-bold">WP ⌘ Palette</p>

          <p className="text-xs! text-white/30">
            Crafted by <a className="text-white/50! focus:ring-0!" href="https://niemo.be" rel="noreferrer" target="_blank">Niemo Studio</a>
          </p>
        </div>

        <div>
          <ul className="flex items-center gap-2">
            <li>
              <NavLink className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`} to="/">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 8V20H19V8H5ZM5 6H19V4H5V6ZM20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM7 10H11V14H7V10ZM7 16H17V18H7V16ZM13 11H17V13H13V11Z"></path></svg>
                <span>Pages</span>
              </NavLink>
            </li>

            <li>
              <NavLink className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`} to="/styling">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C17.5222 2 22 5.97778 22 10.8889C22 13.9556 19.5111 16.4444 16.4444 16.4444H14.4778C13.5556 16.4444 12.8111 17.1889 12.8111 18.1111C12.8111 18.5333 12.9778 18.9222 13.2333 19.2111C13.5 19.5111 13.6667 19.9 13.6667 20.3333C13.6667 21.2556 12.9 22 12 22C6.47778 22 2 17.5222 2 12C2 6.47778 6.47778 2 12 2ZM10.8111 18.1111C10.8111 16.0843 12.451 14.4444 14.4778 14.4444H16.4444C18.4065 14.4444 20 12.851 20 10.8889C20 7.1392 16.4677 4 12 4C7.58235 4 4 7.58235 4 12C4 16.19 7.2226 19.6285 11.324 19.9718C10.9948 19.4168 10.8111 18.7761 10.8111 18.1111ZM7.5 12C6.67157 12 6 11.3284 6 10.5C6 9.67157 6.67157 9 7.5 9C8.32843 9 9 9.67157 9 10.5C9 11.3284 8.32843 12 7.5 12ZM16.5 12C15.6716 12 15 11.3284 15 10.5C15 9.67157 15.6716 9 16.5 9C17.3284 9 18 9.67157 18 10.5C18 11.3284 17.3284 12 16.5 12ZM12 9C11.1716 9 10.5 8.32843 10.5 7.5C10.5 6.67157 11.1716 6 12 6C12.8284 6 13.5 6.67157 13.5 7.5C13.5 8.32843 12.8284 9 12 9Z"></path></svg>
                <span>Styling</span>
              </NavLink>
            </li>

            <li>
              <NavLink className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`} to="/settings">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 3V6H3V8H7V11H9V3H7ZM11 8H21V6H11V8ZM17 13V16H21V18H17V21H15V13H17ZM13 18H3V16H13V18Z"></path></svg>
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>

      </nav>

      <div className="p-5">
        <Outlet />
      </div>
    </>
  );
};

export default BaseLayout;
