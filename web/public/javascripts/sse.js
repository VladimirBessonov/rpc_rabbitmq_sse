// const source = new EventSource('/message');
//
// source.addEventListener('message', message => {
//     console.log('Got', message);
//
//     // Display the event data in the `content` div
//     document.querySelector('#content').innerHTML = event.data;
// });

const source = new EventSource('http://localhost:8080/message');

source.addEventListener('message', event => {
    console.log('Got', event);

    // Display the event data in the `content` div
    document.querySelector('#content').innerHTML = event.data;
});