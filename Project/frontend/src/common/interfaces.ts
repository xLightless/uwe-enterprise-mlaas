import { JSX } from "react";

/**
 * Navigation items for a sidebar.
 *
 * @name - The name of the sidebar item.
 * @items - The items in the sidebar under the name.
 * @items [n] - The name of the item, the function to call when the item is clicked, and the icon to display.
 */
export interface SidebarItem {
    name: string;
    sideBarIcon: JSX.Element;
    items: [string, () => void | null, JSX.Element | null][];
};