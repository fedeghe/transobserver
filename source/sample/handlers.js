Transobserver.addHandler('writeAlert', function (data, remove) {
    var trg = document.getElementById('trg');
    trg.innerHTML = data;
    console.log(remove)
})