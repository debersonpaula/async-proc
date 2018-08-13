import { groupAsyncHandlers, TAsyncProc } from '../src/async-proc';

describe('Testing Async Proc', () => {

    let proc1: TAsyncProc;
    let proc2: TAsyncProc;

    it('create TAsyncProc with success callback', (jestDone) => {
        proc1 = new TAsyncProc((done) => {
            done('success');
        });
        proc1.done(result => {
            expect(result).toBe('success');
        });
        proc1.end(() => {
            jestDone();
        });
    });

    it('create TAsyncProc with fail callback', (jestDone) => {
        proc2 = new TAsyncProc((done, error) => {
            error('fail');
        });
        proc2.error(result => {
            expect(result).toBe('fail');
        });
        proc2.end(() => {
            jestDone();
        });
    });

    it('create groupAsyncHandlers with success', (jestDone) => {
        const proc = groupAsyncHandlers([proc1, proc1]);
        proc.done(result => {
            expect(result).toEqual(['success','success']);
        });
        proc.end(() => {
            jestDone();
        });
    });

    it('create groupAsyncHandlers with fail', (jestDone) => {
        const proc = groupAsyncHandlers([proc1, proc2]);
        proc.error(result => {
            expect(result).toBe('fail');
        });
        proc.end(() => {
            jestDone();
        });
    });
});