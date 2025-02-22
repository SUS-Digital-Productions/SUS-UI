import { NavLink, Outlet } from "react-router";
import { MenuItem } from "./types/MenuItem";

type SidebarProps = {
  items: MenuItem[];
};

export const Sidebar = (props: SidebarProps) => {
  return (
    <div className="flex">
      <nav className="border-r shadow-md h-screen w-60">
        <div className="px-4 flex flex-col space-y-4 py-4">
          {props.items.map((item, index) => (
            <NavLink
              key={index}
              className={({ isActive }) =>
                isActive
                  ? "text-green-600 text-lg font-semibold"
                  : "text-gray-500 hover:text-green-600 text-lg"
              }
              to={item.link}
            >
              {item.title}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content (Outlet) */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};
