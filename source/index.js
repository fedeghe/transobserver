var Transobserver = (function () {
    function Tobserver() {
        this.data = JSON.parse(Tobserver.storage.getItem(Tobserver.key))
    }
    Tobserver.key = 'transObserverKey';
    Tobserver.storage = localStorage;

    Tobserver.prototype.commit = function () {
        Tobserver.storage.setItem(Tobserver.key, JSON.stringify(this.data))
    };

    Tobserver.prototype.add = function (topic, obj) {
        this.data[topic] = obj
        this.commit()
    };

    Tobserver.prototype.remove = function (topic) {
        this.data[topic] = null;
        delete this.data[topic];
        this.commit()
    };

    return new Transobserver()
})()


(typeof exports === 'object') && (module.exports = Transobserver);