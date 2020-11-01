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

Transobserver.addHandler(
    function writeCars(data, remove) {
        var trg = document.getElementById('cars');
        trg.innerHTML = JSON.stringify(data, null, 2);
    }
)
Transobserver.addHandler(
    function writeStations(data, remove) {
        var trg = document.getElementById('stations');
        trg.innerHTML = JSON.stringify(data, null, 2);
        if (data.length === 3) {
            remove()
        }
    }
)