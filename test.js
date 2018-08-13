const asyncProc = require('./index');

// create handler with done
const h1 = new asyncProc.TAsyncProc((done, error) => {
    setTimeout(() => {
        done('test h1');
    }, 1000);
});
// create handler with error
const h2 = new asyncProc.TAsyncProc((done, error) => {
    setTimeout(() => {
        error('error h2')
    }, 1000);
});
// create handler grouping h1 and h2
const h3 = asyncProc.groupAsyncHandlers([h1, h2]);

// check handlers
h1.done((value) => console.log('h1 done =', value));
h2.error((err) => console.log('h2 error =', err));
h3.end(() => console.log('h3 finished'));



// convert Promise to AsyncProc with success
const p1 = asyncProc.convertPromise(Promise.resolve('promise-success'));
p1.done(result => {
    console.log('convertPromise =', result);
});

// convert Promise to AsyncProc with fail
const p2 = asyncProc.convertPromise(Promise.reject('promise-fail'));
p2.error(result => {
    console.log('convertPromise =', result);
});

// create AsyncProc with Done
const procDone = asyncProc.createDone('done created');
procDone.done(result => {
    console.log('createDone =', result);
});

// create AsyncProc with Error
const procError = asyncProc.createError('error created');
procError.error(result => {
    console.log('createError =', result);
});
