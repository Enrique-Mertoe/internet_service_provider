//@ts-ignore
import DashboardLayout from "@/layouts/Dashboard"

import DashboardContent from "@/pages/dashboard/page.view";

export default function Dashboard() {
    return (
        <>
            <DashboardLayout>
                <DashboardContent/>
            </DashboardLayout>
        </>
    )
}