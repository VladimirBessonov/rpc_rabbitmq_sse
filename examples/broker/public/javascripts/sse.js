const eventSource = new EventSource("/sse")

eventSource.onmessage = function (e) {
    console.log(e.data)

}