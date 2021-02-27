$(document).ready(function () {
    $('.gravar-produto').click(function (e) {
        e.preventDefault();
        if (validateFormProduto()) {
            let dataToStorage = getFormDataAsJson('produto-form');
            insertOnStorage(dataToStorage);
            createAlert("Deseja gravar um novo produto?");
        }
    });

    $('.valor').maskMoney({
        prefix: 'R$ ',
        decimal: ',',
        thousands: '.'
    });

});

insertOnStorage = (dataToStorage) => {
    let produtos = new Array()

    if (localStorage.hasOwnProperty("produtos")) {
        produtos = JSON.parse(localStorage.getItem("produtos"))
        dataToStorage.id = produtos.length + 1;
    }
    produtos.push(dataToStorage)

    localStorage.setItem("produtos", JSON.stringify(produtos))
}

validateFormProduto = () => {
    let ul = $('.alert-danger');
    ul.find('ul').html('');
    ul.addClass('d-none');

    let form = $('form');
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
    document.getElementById("produto-form").reset();
}