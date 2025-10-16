import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {BASE_URL} from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function url(url: string) {
    return import.meta.env.MODE == "production" ? url : BASE_URL + url;
}

type GuardedPromise<T> = {
    then: (cb: (res: T) => void) => void;
}

export function GuardedPromise<T>(executor: () => Promise<T>): GuardedPromise<T> {
    let actualPromise: Promise<T> | null = null;

    const createPromise = () => {
        if (!actualPromise) {
            actualPromise = executor();
        }
        return actualPromise;
    };

    // Create a thenable object that looks like a promise
    const lazyPromise = {
        then<TResult1 = T, TResult2 = never>(
            onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
            onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
        ): Promise<TResult1 | TResult2> {
            return createPromise().then(onFulfilled, onRejected);
        },
        [Symbol.toStringTag]: 'Promise' as const
    };

    return lazyPromise as GuardedPromise<T>;
}