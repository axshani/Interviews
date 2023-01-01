const createPromise = (timeout) => new Promise((resolve) => {
    setTimeout(() => {
        console.log(`done after ${timeout / 1000}s`)
        resolve(timeout)
    }, timeout)
});

const promise1 = () => createPromise(4000);
const promise2 = () => createPromise(3000);
const promise3 = () => createPromise(2000);
const promise4 = () => createPromise(1000);

async function _logPromiseDuration(promise) {
    const now = Date.now();

    await promise

    console.log(`promise duration:`, Date.now() - now)
}

function promiseAll(promises) {
    return Promise.all(promises)
}

function MyPromiseAll(promises) {

}

async function run() {
    // comment
    await _logPromiseDuration(promiseAll([promise1(), promise2(), promise3(), promise4()]).then((value) => console.log(value)))

    // uncomment
    // await logPromiseDuration(MyPromiseAll([promise1(), promise2(), promise3(), promise4()]).then((value) => console.log(value)))
}

run();