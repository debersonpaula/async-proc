type AsyncDone<T> = (result: T) => void;
type AsyncError<E> = (error: E) => void;
type AsyncEnd = () => void;
type AsyncProc<T, E> = (done: AsyncDone<T>, error: AsyncError<E>) => void;

export class TAsyncProc<T = any, E = any> {
    private _hDone: AsyncDone<T>[] = [];
    private _hError: AsyncError<E>[] = [];
    private _hEnd: AsyncEnd[] = [];
    private _fnDone?: () => void;
    private _fnError?: () => void;

    /**
     * Create TAsyncHandler to handle execution of async functions
     * @param {(done,error) => void} callback 
     */
    constructor(callback: AsyncProc<T, E>) {
        callback && callback(this._done.bind(this), this._error.bind(this));
    }

    /**
     * Executes the callback after successfull completions
     * @param callback 
     */
    done(callback: AsyncDone<T>): TAsyncProc<T, E> {
        this._hDone.push(callback);
        this._fnDone && this._fnDone();
        return this;
    }

    /**
     * Executes the callback after failed execution
     * @param callback 
     */
    error(callback: AsyncError<E>): TAsyncProc<T, E> {
        this._hError.push(callback);
        this._fnError && this._fnError();
        return this;
    }

    /**
     * Executes the callback after execution (success or fail)
     * @param callback 
     */
    end(callback: AsyncEnd): TAsyncProc<T, E> {
        this._hEnd.push(callback);
        this._fnDone && this._fnDone();
        this._fnError && this._fnError();
        return this;
    }

    private _done(data: any) {
        this._exec(this._hDone, data);
        this._exec(this._hEnd);
        if (!this._fnDone) {
            this._fnDone = () => {
                this._done(data);
            };
        }
    }

    private _error(data: any) {
        this._exec(this._hError, data);
        this._exec(this._hEnd);
        if (!this._fnError) {
            this._fnError = () => {
                this._error(data);
            };
        }
    }

    private _exec(list: Function[], data?: any) {
        list.forEach((item) => {
            item(data);
        });
        list.length = 0;
    }
}

/**
 * Create AsyncProc from array (like Promise.all)
 * @param list array of AsyncProcs
 */
export function groupAsyncHandlers(list: TAsyncProc[]): TAsyncProc {
    return new TAsyncProc((done, error) => {
        const doneList: any[] = [];
        const errorList: any[] = [];
        let counter: number = 0;

        const exec = () => {
            if (counter == list.length) {
                if (errorList.length) {
                    error(errorList[0]);
                } else {
                    done(doneList);
                }
            }
        }

        doneList.length = list.length;

        for (let i = 0; i < list.length; i++) {
            list[i].done(data => {
                doneList[i] = data;
            }).error(data => {
                errorList.push(data);
            }).end(() => {
                counter++;
                exec();
            });
        }
    });
}

/**
 * Convert Promise object to AsyncProc
 * @param promiseObject 
 */
export function convertPromise<T = any, E = any>(promiseObject: Promise<T>): TAsyncProc<T, E> {
    return new TAsyncProc((done, error) => {
        promiseObject
            .then(value => done(value))
            .catch(reason => error(reason));
    });
}

/**
 * Create AsyncProc with Done status
 * @param result object to be result of done
 */
export function createDone<T = any>(result: T) {
    return new TAsyncProc<T>((done, error) => {
        done(result);
    });
}

/**
 * Create AsyncProc with Error status
 * @param result object to be result of error
 */
export function createError<E = any>(result: E) {
    return new TAsyncProc<any, E>((done, error) => {
        error(result);
    });
}
