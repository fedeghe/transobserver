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
        console.log('start')
        var self = this;        
        /*
        topic : {
            endpoint: {
                handlerName: Bool // maybe not useful as a hash
            }
        }
         */
        function requestAll() {
            postData('http://127.0.0.1:4000/transObserver', self.data, consume)
        }
        function consume(data) {
            console.log('data back');
            console.log(data);
        }
        this.to = setTimeout(requestAll, timeout)
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
            this.data[endpoint] = {};
        }
        if (!(handlerName in this.data[endpoint])) {
            this.data[endpoint][handlerName] = true;
            changed = true;
        }
        !changed && console.log('nothing changed +')
        changed && this.commit();
    };

    Tobserver.prototype.remove = function (endpoint, handlerName) {
        var changed = false;
        if (endpoint in this.data && this.data[endpoint].indexOf(handlerName) >= 0) {
            this.data[endpoint][handlerName] = false;
            changed = true;
        }
        !changed && console.log('nothing changed -')
        changed && this.commit();
    };

    return new Tobserver();
})()

typeof exports === 'object' && (module.exports = Transobserver);
