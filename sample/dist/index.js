var Transobserver = (function () {

    var key =  'transObserverKey',
        storage = localStorage;

    function getKey(topic, endpoint) {
        return topic + '---' + endpoint;
    } 
    function Tobserver() {
        this.handlers = {};
        this.to = null;
        var maybe = storage.getItem(key)
        this.data = maybe ? JSON.parse(maybe) : {};

        this.revive();
    }

    // refill the handlers, 
    Tobserver.prototype.revive = function () {

    };
    Tobserver.prototype.start = function (timeout) {
        console.log('start')
        var self = this;
        function requestAll() {
            console.log('requesting all')
            for (var topic in self.data) {
                request(topic)
            }
        }
        function request(topic) {
            console.log('requesting topic ' + topic)
            console.log(self)

            for (var ep in self.data[topic]) {
                for (var handler in self.data[topic][ep]) {
                    if (handler in self.handlers) {
                        self.handlers[handler]('somedata')
                    }
                }
            }
        }
        this.to = setTimeout(requestAll, timeout)
    };
    Tobserver.prototype.commit = function () {
        storage.setItem(key, JSON.stringify(this.data));
        
    };

    Tobserver.prototype.addHandlers = function (handlers) {
        for (var h in handlers) {
            this.addHandler(h, handlers[h]);
        }
    };
    Tobserver.prototype.addHandler = function (handlerName, func) {
        this.handlers[handlerName] = func;
    };

    Tobserver.prototype.add = function (topic, endpoint, handlerName) {
        var changed = false;
        if (!(topic in this.data))
            this.data[topic] = {};
        if (!(endpoint in this.data[topic]))
            this.data[topic][endpoint] = {};
        if (!(handlerName in this.data[topic][endpoint])) {
            this.data[topic][endpoint][handlerName] = true;
            changed = true;
        }
        changed && this.commit();
    };



    Tobserver.prototype.remove = function (topic, endpoint) {
        var key = getKey(topic, endpoint)
        this.data[key] = null;
        delete this.data[key];
        this.commit();
    };

    return new Tobserver();
})()

typeof exports === 'object' && (module.exports = Transobserver);