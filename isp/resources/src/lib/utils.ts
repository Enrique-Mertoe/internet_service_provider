import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {BASE_URL} from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function url(url: string) {
    return import.meta.env.MODE == "production" ? url : BASE_URL + url;
}