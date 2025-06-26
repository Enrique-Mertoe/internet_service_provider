import type {route as routeFn} from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}
declare type Closure = (...args) => void;

declare interface Package {
    id: number;
    name: string;
    speed: string;
    duration: string;

}


declare interface Client {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    package: {
        id: number;
        name: string;
        speed: string;
        duration: string;
        type: string;
        price: string;
    };
    status: string;
    dateJoined: string;
    lastPayment: string;
    avatar: string;
    dueAmount: number;
    router_username: string;
    router_password: string;
    created_at: string;
    due: string;
    package_start: string;
}