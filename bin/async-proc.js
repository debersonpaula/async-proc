"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TAsyncProc = /** @class */ (function () {
    /**
     * Create TAsyncHandler to handle execution of async functions
     * @param {(done,error) => void} callback
     */
    function TAsyncProc(callback) {
        this._hDone = [];
        this._hError = [];
        this._hEnd = [];
        callback && callback(this._done.bind(this), this._error.bind(this));
    }
    /**
     * Executes the callback after successfull completions
     * @param callback
     */
    TAsyncProc.prototype.done = function (callback) {
        this._hDone.push(callback);
        this._fnDone && this._fnDone();
        return this;
    };
    /**
     * Executes the callback after failed execution
     * @param callback
     */
    TAsyncProc.prototype.error = function (callback) {
        this._hError.push(callback);
        this._fnError && this._fnError();
        return this;
    };
    /**
     * Executes the callback after execution (success or fail)
     * @param callback
     */
    TAsyncProc.prototype.end = function (callback) {
        this._hEnd.push(callback);
        this._fnDone && this._fnDone();
        this._fnError && this._fnError();
        return this;
    };
    TAsyncProc.prototype._done = function (data) {
        var _this = this;
        this._exec(this._hDone, data);
        this._exec(this._hEnd);
        if (!this._fnDone) {
            this._fnDone = function () {
                _this._done(data);
            };
        }
    };
    TAsyncProc.prototype._error = function (data) {
        var _this = this;
        this._exec(this._hError, data);
        this._exec(this._hEnd);
        if (!this._fnError) {
            this._fnError = function () {
                _this._error(data);
            };
        }
    };
    TAsyncProc.prototype._exec = function (list, data) {
        list.forEach(function (item) {
            item(data);
        });
        list.length = 0;
    };
    return TAsyncProc;
}());
exports.TAsyncProc = TAsyncProc;
/**
 * Create AsyncProc from array (like Promise.all)
 * @param list array of AsyncProcs
 */
function groupAsyncHandlers(list) {
    return new TAsyncProc(function (done, error) {
        var doneList = [];
        var errorList = [];
        var counter = 0;
        var exec = function () {
            if (counter == list.length) {
                if (errorList.length) {
                    error(errorList[0]);
                }
                else {
                    done(doneList);
                }
            }
        };
        doneList.length = list.length;
        var _loop_1 = function (i) {
            list[i].done(function (data) {
                doneList[i] = data;
            }).error(function (data) {
                errorList.push(data);
            }).end(function () {
                counter++;
                exec();
            });
        };
        for (var i = 0; i < list.length; i++) {
            _loop_1(i);
        }
    });
}
exports.groupAsyncHandlers = groupAsyncHandlers;
/**
 * Convert Promise object to AsyncProc
 * @param promiseObject
 */
function convertPromise(promiseObject) {
    return new TAsyncProc(function (done, error) {
        promiseObject
            .then(function (value) { return done(value); })
            .catch(function (reason) { return error(reason); });
    });
}
exports.convertPromise = convertPromise;
/**
 * Create AsyncProc with Done status
 * @param result object to be result of done
 */
function createDone(result) {
    return new TAsyncProc(function (done, error) {
        done(result);
    });
}
exports.createDone = createDone;
/**
 * Create AsyncProc with Error status
 * @param result object to be result of error
 */
function createError(result) {
    return new TAsyncProc(function (done, error) {
        error(result);
    });
}
exports.createError = createError;
