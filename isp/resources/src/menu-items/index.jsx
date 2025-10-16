// project import
import dashboard from './dashboard';
import support from './support';
import customers from "./customers";
import network from "./network";
import services from "./services";
import billing from "@/menu-items/billing.js";
import analytics from "@/menu-items/analytics.jsx";
import team from "@/menu-items/team.jsx";
import tools from "@/menu-items/tools.jsx";
import settings from "@/menu-items/settings.jsx";

// ==============================|| MENU ITEMS ||============================== //
// Main menu items
const menuItems = {
    items: [dashboard, network, support, analytics, tools, settings]
};

export default menuItems;
