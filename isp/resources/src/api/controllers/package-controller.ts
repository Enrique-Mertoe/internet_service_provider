import {api} from "@/utils/api";
import {Package} from "@/types/global";

const pkgController = {
    async forUser(): Promise<Package[]> {
        const {data} =
            await api.get({
                route: "API_PACKAGE_DEFAULT",
                params: {format: 'json'}
            })
        return data ?? []
    }
}

export default pkgController;