import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import {route, RouteName, RouteParameters, ROUTES} from './routes';

interface ApiConfig extends AxiosRequestConfig {
    route: RouteName;
    params?: RouteParameters;
}

// function guardedAsync<T>(p: Promise<T>) {
//     let used = false;
//
//     const wrapped = new Promise<T>((resolve, reject) => {
//         p.then(resolve).catch(reject);
//     });
//
//     Object.defineProperty(wrapped, 'then', {
//         get() {
//             used = true;
//             return wrapped.then.bind(wrapped);
//         },
//     });
//
//     queueMicrotask(() => {
//         if (!used) {
//             console.warn('⚠️ Async result was not awaited!');
//         }
//     });
//
//     return wrapped;
// }
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
type APIData<T> = {
    data: T | null, error: Error | null
}
type ApiPromise<T> = {
    then: (cb: (res: APIData<T>) => void) => void;
}

function guardedAsync<T>(executor: () => Promise<APIData<T>>): ApiPromise<T> {
    let actualPromise: Promise<APIData<T>> | null = null;

    const createPromise = () => {
        if (!actualPromise) {
            actualPromise = executor();
        }
        return actualPromise;
    };

    // Create a thenable object that looks like a promise
    const lazyPromise = {
        then<TResult1 = T, TResult2 = never>(
            onFulfilled?: ((value: APIData<T>) => TResult1 | PromiseLike<TResult1>) | null,
            onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
        ): Promise<TResult1 | TResult2> {
            return createPromise().then(onFulfilled, onRejected);
        },

        // catch<TResult = never>(
        //     onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
        // ): Promise<T | TResult> {
        //     return createPromise().catch(onRejected);
        // },
        //
        // finally(onFinally?: (() => void) | null): Promise<T> {
        //     return createPromise().finally(onFinally);
        // },

        [Symbol.toStringTag]: 'Promise' as const
    };

    return lazyPromise as ApiPromise<T>;
}


class ApiClient {
    private baseURL: string;

    constructor(baseURL = import.meta.env.VITE_API_URL || '') {
        this.baseURL = baseURL;
    }

    private buildUrl(routeName: RouteName, params: RouteParameters = {}): string {
        return route(ROUTES[routeName], params, true);
    }

    get<T = any>(config: ApiConfig): ApiPromise<T> {
        const url = this.buildUrl(config.route, config.params);
        return guardedAsync<T>(() => {
            return this.dispatch<any>(axios.get<T>(url, {...config, url}))
        });
    }

    post<T = any>(config: ApiConfig & { data?: any }) {
        const url = this.buildUrl(config.route, config.params);
        return guardedAsync<T>(() => {
            return this.dispatch<any>(axios.post<T>(url, config.data, {...config, url}))
        });
    }

    async put<T = any>(config: ApiConfig & { data?: any }): Promise<AxiosResponse<T>> {
        const url = this.buildUrl(config.route, config.params);
        return axios.put<T>(url, config.data, {...config, url});
    }

    async delete<T = any>(config: ApiConfig): Promise<AxiosResponse<T>> {
        const url = this.buildUrl(config.route, config.params);
        return axios.delete<T>(url, {...config, url});
    }

    async patch<T = any>(config: ApiConfig & { data?: any }): Promise<AxiosResponse<T>> {
        const url = this.buildUrl(config.route, config.params);
        return axios.patch<T>(url, config.data, {...config, url});
    }

    private dispatch<T>(promise: Promise<AxiosResponse<T>>) {
        return new Promise<APIData<T>>(resolve => {
            promise.then((res) => resolve({data: res.data, error: null})).catch(e => resolve({
                data: null, error: new Error(e.response?.data?.detail || e.message)
            }));
        });
    }
}

export const api = new ApiClient();