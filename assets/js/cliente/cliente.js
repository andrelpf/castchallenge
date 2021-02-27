$(document).ready(function () {
    $('.gravar-cliente').click(function (e) {
        e.preventDefault();
        if (validateFormCliente()) {
            let dataToStorage = getFormDataAsJson('cliente-form');
            insertOnStorage(dataToStorage);
            createAlert("Deseja gravar um novo cliente?");
        }
    });
});

insertOnStorage = (dataToStorage) => {
    let usuarios = new Array()

    if (localStorage.hasOwnProperty("usuarios")) {
        usuarios = JSON.parse(localStorage.getItem("usuarios"))
        dataToStorage.id = usuarios.length + 1;
    }
    usuarios.push(dataToStorage)

    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}

validateFormCliente = () => {
    let ul = $('.alert-danger');
    ul.find('ul').html('');
    ul.addClass('d-none');

    let form = $('#cliente-form');
    let msg = '';
    let arrayForm = form.serializeArray();

    $.map(arrayForm, function (input) {
        //Key                   Value
        if (input['value'] == '') {
            msg += '<li> O campo "' + input['name'] + '" é obrigatório';
        }
    });
    if (msg == '') {
        return true;
    } else {
        ul.find('ul').html(msg);
        ul.removeClass('d-none');
    }
    return false;
}

resetForm = () => {
    document.getElementById("cliente-form").reset();
}