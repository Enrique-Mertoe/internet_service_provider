import DashboardLayout from "@/layouts/Dashboard"
import ThemeCustomization from "@/themes"
import DashboardContent from "@/pages/dashboard/page.view";

export default function Dashboard() {
    return (
        <ThemeCustomization>
            <DashboardLayout>
                <DashboardContent/>
            </DashboardLayout>
        </ThemeCustomization>
    )
}