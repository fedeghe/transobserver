// Transobserver.addHandler(function writeCars(data, remove) {
//     var trg = document.getElementById('cars');
//     trg.innerHTML = data;
//     console.log(remove)
// })
// Transobserver.addHandler(function writeStations(data, remove) {
//     var trg = document.getElementById('stations');
//     trg.innerHTML = data;
//     console.log(remove)
// })

Transobserver.addHandlers([function writeCars(data, remove) {
    var trg = document.getElementById('cars');
    trg.innerHTML = data;
    console.log(remove)
}, function writeStations(data, remove) {
    var trg = document.getElementById('stations');
    trg.innerHTML = data;
    console.log(remove)
}])