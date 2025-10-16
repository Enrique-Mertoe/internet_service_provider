import {api} from "@/utils/api";
import {Package} from "@/types/global";
import {QueryData, filtered} from "@/api/controllers/helper.controller";

const devices = {
    async forUser(): Promise<Package[]> {
        const {data} =
            await api.get({
                route: "API_EQUIPMENT_DEFAULT",
                params: {format: 'json'}
            })
        return data ?? []
    },
    async filter(filters: { [key: string]: any }): Promise<QueryData<any>> {
        const {data} =
            await api.get({
                route: "API_EQUIPMENT_DEFAULT",
                params: {format: 'json', ...filters}
            })
        return filtered(data ?? [])
    },
    async provision(name: string): Promise<any> {
        const {data} =
            await api.post({
                route: "API_EQUIPMENT_PROVISION",
                data: {name},
                params: {format: 'json'}
            })
        return data
    },
}

export default devices;