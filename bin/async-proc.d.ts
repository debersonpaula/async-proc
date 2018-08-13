declare type AsyncDone<T> = (result: T) => void;
declare type AsyncError<E> = (error: E) => void;
declare type AsyncEnd = () => void;
declare type AsyncProc<T, E> = (done: AsyncDone<T>, error: AsyncError<E>) => void;
export declare class TAsyncProc<T = any, E = any> {
    private _hDone;
    private _hError;
    private _hEnd;
    private _fnDone?;
    private _fnError?;
    /**
     * Create TAsyncHandler to handle execution of async functions
     * @param {(done,error) => void} callback
     */
    constructor(callback: AsyncProc<T, E>);
    /**
     * Executes the callback after successfull completions
     * @param callback
     */
    done(callback: AsyncDone<T>): TAsyncProc<T, E>;
    /**
     * Executes the callback after failed execution
     * @param callback
     */
    error(callback: AsyncError<E>): TAsyncProc<T, E>;
    /**
     * Executes the callback after execution (success or fail)
     * @param callback
     */
    end(callback: AsyncEnd): TAsyncProc<T, E>;
    private _done;
    private _error;
    private _exec;
}
/**
 * Create AsyncProc from array (like Promise.all)
 * @param list array of AsyncProcs
 */
export declare function groupAsyncHandlers(list: TAsyncProc[]): TAsyncProc;
/**
 * Convert Promise object to AsyncProc
 * @param promiseObject
 */
export declare function convertPromise<T = any, E = any>(promiseObject: Promise<T>): TAsyncProc<T, E>;
/**
 * Create AsyncProc with Done status
 * @param result object to be result of done
 */
export declare function createDone<T = any>(result: T): TAsyncProc<T, any>;
/**
 * Create AsyncProc with Error status
 * @param result object to be result of error
 */
export declare function createError<E = any>(result: E): TAsyncProc<any, E>;
export {};
