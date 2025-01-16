import { catchError, map, Observable, of, startWith } from "rxjs";

interface Loading {
    state: "loading";
}

interface Loaded<T> {
    state: "loaded";
    data: T;
}

interface Errored {
    state: "error";
    error: Error;
}

export type LoadingState<T = unknown> = Loading | Loaded<T> | Errored;

export function toLoadingStateStream<T>(
    source$: Observable<T>,
): Observable<LoadingState<T>> {
    return source$.pipe(
        map((data: T) => ({ state: "loaded", data } as Loaded<T>)),
        catchError((error: Error) => of({ state: "error", error } as Errored)),
        startWith({ state: "loading" } as Loading),
    );
}