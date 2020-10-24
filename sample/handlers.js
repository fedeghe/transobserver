Transobserver.addHandler('writeAlert', function (data) {
    var trg = document.getElementById('trg');
    trg.innerHTML = data
})