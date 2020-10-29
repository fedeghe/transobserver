var Transobserver = (function () {
    var key = 'transObserverKey',
        storage = localStorage,
        postData = function (url, data, cb) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);  
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
            
            xhr.onreadystatechange = function() {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    console.log(xhr)
                    cb(JSON.parse(xhr.responseText));
                }
            }
            xhr.send(JSON.stringify(data));
        };

    function getKey(topic, endpoint) {
        return topic + '---' + endpoint;
    }
    
    function Tobserver() {
        this.handlers = {};
        this.to = null;
        this.lastResponse = '';
        var maybe = storage.getItem(key)
        this.data = maybe ? JSON.parse(maybe) : {};
    }

    Tobserver.prototype.start = function (timeout) {
        var self = this;        
        function requestAll() {
            postData('http://127.0.0.1:4000/transObserver', self.data, consume)
        }
        function consume(data) {
            data.forEach(function (r) {
                if (r.url in self.data) {
                    self.data[r.url].forEach(function (handlerName) {
                        self.handlers[handlerName](
                            r.data,
                            function () {self.remove(r.url, handlerName)}
                        );
                    });
                }
            })
            request();
        }
        function request() {
            self.to = setTimeout(requestAll, timeout)
        }
        request();
    };

    Tobserver.prototype.commit = function () {
        storage.setItem(key, JSON.stringify(this.data));
    };

    Tobserver.prototype.addHandlers = function (handlers) {
        var self = this
        handlers.map(function (h) {
            self.addHandler(h);
        });
    };

    Tobserver.prototype.addHandler = function (func) {
        if (typeof func === 'function') {
            this.handlers[func.name] = func;
        }
    };

    Tobserver.prototype.responseIsUpdated = function (newResponseObj) {
        var newResponse = JSON.stringify(newResponseObj),
            result = this.lastResponse !== newResponse;
        this.lastResponse = newResponse;
        return result;
    };

    Tobserver.prototype.add = function (endpoint, handlerName) {
        var changed = false;
        if (!(endpoint in this.data)) {
            this.data[endpoint] = [];
        }
        if (this.data[endpoint].indexOf(handlerName) === -1) {
            this.data[endpoint].push(handlerName);
            changed = true;
        }
        !changed && console.log('nothing changed +')
        changed && this.commit();
    };

    Tobserver.prototype.remove = function (endpoint, handlerName) {
        var changed = false,
            index;
        if (endpoint in this.data) {
            index = this.data[endpoint].indexOf(handlerName)
            if (index > -1) {

            }
            this.data[endpoint].splice(index, 1)
            changed = true;
        }
        !changed && console.log('nothing changed -')
        changed && this.commit();
    };

    return new Tobserver();
})()

typeof exports === 'object' && (module.exports = Transobserver);
