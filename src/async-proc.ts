type AsyncDone = (result: any) => void;
type AsyncError = (error: any) => void;
type AsyncEnd = () => void;
type AsyncProc = (done: AsyncDone, error: AsyncError) => void;

export class TAsyncProc {
    private _hDone: AsyncProc[] = [];
    private _hError: AsyncProc[] = [];
    private _hEnd: AsyncProc[] = [];
    private _fnDone?: Function;
    private _fnError?: Function;

    /**
     * Create TAsyncHandler to handle execution of async functions
     * @param {(done,error) => void} callback 
     */
    constructor(callback: AsyncProc) {
        callback && callback(this._done.bind(this), this._error.bind(this));
    }

    /**
     * Executes the callback after successfull completions
     * @param callback 
     */
    done(callback: AsyncDone): TAsyncProc {
        this._hDone.push(callback);
        this._fnDone && this._fnDone();
        return this;
    }

    /**
     * Executes the callback after failed execution
     * @param callback 
     */
    error(callback: AsyncError): TAsyncProc {
        this._hError.push(callback);
        this._fnError && this._fnError();
        return this;
    }

    /**
     * Executes the callback after execution (success or fail)
     * @param callback 
     */
    end(callback: AsyncEnd): TAsyncProc {
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

export function groupAsyncHandlers(list: TAsyncProc[]): TAsyncProc {
    return new TAsyncProc((done, error) => {
        const doneList: any[] = [];
        const errorList: any[] = [];
        let counter: number = 0;

        const exec = ()=>{
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
