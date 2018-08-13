declare type AsyncDone = (result: any) => void;
declare type AsyncError = (error: any) => void;
declare type AsyncEnd = () => void;
declare type AsyncProc = (done: AsyncDone, error: AsyncError) => void;
export declare class TAsyncProc {
    private _hDone;
    private _hError;
    private _hEnd;
    private _fnDone?;
    private _fnError?;
    /**
     * Create TAsyncHandler to handle execution of async functions
     * @param {(done,error) => void} callback
     */
    constructor(callback: AsyncProc);
    /**
     * Executes the callback after successfull completions
     * @param callback
     */
    done(callback: AsyncDone): TAsyncProc;
    /**
     * Executes the callback after failed execution
     * @param callback
     */
    error(callback: AsyncError): TAsyncProc;
    /**
     * Executes the callback after execution (success or fail)
     * @param callback
     */
    end(callback: AsyncEnd): TAsyncProc;
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
export declare function convertPromise(promiseObject: Promise<any>): TAsyncProc;
/**
 * Create AsyncProc with Done status
 * @param result object to be result of done
 */
export declare function createDone(result: any): TAsyncProc;
/**
 * Create AsyncProc with Error status
 * @param result object to be result of error
 */
export declare function createError(result: any): TAsyncProc;
export {};
