import { catchError, map, Observable, of, startWith } from "rxjs";
import { Errored, Loaded, Loading, LoadingState } from "./contracts";

export type { LoadingState };

export function toLoadingStateStream<T>(
    source$: Observable<T>,
): Observable<LoadingState<T>> {
    return source$.pipe(
        map((data: T) => ({ state: "loaded", data } as Loaded<T>)),
        catchError((error: Error) => of({ state: "error", error } as Errored)),
        startWith({ state: "loading" } as Loading),
    );
}