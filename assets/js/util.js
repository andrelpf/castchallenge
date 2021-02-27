
$(document).on('click', '.btn-gravar-novo', function () {
    resetForm();
    $('.modal').modal('toggle');
});

$(document).on('click', '.btn-fechar', function () {
    window.location.href = $('.btn-index').prop('href');
});

getFormDataAsJson = (id = 'exemplo-id', stringify = false) => {
    let form = $('#' + id);
    let arrayForm = form.serializeArray();
    let object = { id: 1 };
    let json;
    $.map(arrayForm, function (input) {
        //Key                   Value
        if (input['value'].includes('R$')) {
            object[input['name']] = $('#' + input['name']).maskMoney('unmasked')[0];
        } else {
            object[input['name']] = input['value'];
        }
    });
    //Cast
    if (stringify) {
        json = JSON.stringify(object);
        return json;
    }
    return object;
}


returnProdutos = () => {
    let produtos = new Array();
    produtos = JSON.parse(localStorage.getItem("produtos"));
    return produtos;
}

returnClientes = () => {
    let clientes = new Array();
    clientes = JSON.parse(localStorage.getItem("usuarios"));
    return clientes;
}

returnCliente = (id) => {
    return returnClientes().filter(function (objeto) {
        return objeto.id == id
    })[0];
}

returnProduto = (id) => {
    return returnProdutos().filter(function (objeto) {
        return objeto.id == id
    })[0];
}


createAlert = (mensagem = null, btn_fechar = 'Fechar') => {
    var html = '';

    if ($('.modal').length <= 0) {
        html += '<div class="modal" tabindex="-1" role="dialog">';
        html += '<div class="modal-dialog" role="document">';
        html += ' <div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<h5 class="modal-title">Alerta!</h5>';
        html += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
        html += '<span aria-hidden="true">&times;</span>';
        html += ' </button>';
        html += '</div>';
        html += '<div class="modal-body">';
        html += '<p>' + mensagem + '</p>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-primary btn-gravar-novo">Gravar novo</button>';
        html += '<button type="button" class="btn btn-secondary btn-fechar" data-dismiss="modal">' + btn_fechar + '</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        html += '</div >';
        $('.container').append(html);
    }

    $('.modal').modal('toggle');
    return;
}

numberToReal = (numero) => {
    if ((typeof numero) !== "number") {
        numero = Number(numero);
    }

    var numero = numero.toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}