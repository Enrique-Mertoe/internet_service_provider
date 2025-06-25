import useSWR, {mutate} from 'swr';
import {useMemo} from 'react';

const initialState = {
    isDashboardDrawerOpened: true
};

const endpoints = {
    key: 'api/menu',
    master: 'master',
    dashboard: '/dashboard' // server URL
};

export function useGetMenuMaster() {
    const {data, isLoading} = useSWR(endpoints.key + endpoints.master, () => initialState, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    return useMemo(
        () => ({
            menuMaster: data,
            menuMasterLoading: isLoading
        }),
        [data, isLoading]
    );
}

export function handlerDrawerOpen(isDashboardDrawerOpened: any) {
    mutate(
        endpoints.key + endpoints.master,
        (currentMenuMaster) => {
            return {...currentMenuMaster, isDashboardDrawerOpened};
        },
        false
    );
}
