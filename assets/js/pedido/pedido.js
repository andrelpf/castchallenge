
$(document).ready(function () {
    createSelectCliente();
    appendCardProduto();

    $('.valor').maskMoney({
        prefix: 'R$ ',
        decimal: ',',
        thousands: '.'
    });
});

$(document).on('click', '.adicionar-produto', function (e) {
    let produto_id = $('#produto-id').val();
    let produto = returnProduto(produto_id);

    if (validateProduto(produto)) {
        addProduto(produto);
        $('.modal-produto').modal('toggle');
    }
});

$(document).on('click', '.finalizar-venda', function (e) {
    e.preventDefault();
    if (validateFormPedido()) {
        insertOnStorage(constructJsonPedido());
        window.location.href = $('.btn-venda').prop('href');
    }
})

$(document).on('click', '.selecionar-produto', function (e) {
    let produto_id = $(e.currentTarget).parents('.card-body-top').find('.produto-id').val();
    $('#produto-id').val(produto_id);
    $('.titulo-produto').html(returnProduto(produto_id).descricao);
    $('#quantidade,#desconto').val('');
    $('.modal-produto').modal('toggle');
});

validateProduto = (produto) => {
    let ul = $('.alert-modal');
    let msg = '';
    ul.find('ul').html('');
    ul.addClass('d-none');

    let qtd = $('#quantidade').val();
    let desconto = $('#desconto').maskMoney('unmasked')[0];

    //Validações
    if (parseInt(qtd) + sumQtdAdicionada(produto.id) > produto.quantidade) {
        msg += '<li> A quantidade deve ser menor ou igual a ' + (produto.quantidade - sumQtdAdicionada(produto.id));
    }

    if (parseFloat(desconto) > produto.desconto) {
        msg += '<li> O desconto unitário deve ser menor ou igual a R$ ' + numberToReal(produto.desconto);
    }

    if (msg == '') {
        $('.produto-qtd-' + produto.id).html('Quantidade: ' + (produto.quantidade - (parseInt(qtd) + sumQtdAdicionada(produto.id))))
        return true;
    } else {
        ul.find('ul').html(msg);
        ul.removeClass('d-none');
    }
    return false;
}

getAllProdutosAsJson = () => {
    let map = $('.produtos-adicionados').find('tr').map(function () {
        var values = {};
        $('input', $(this)).each(function () {
            values[this.name] = this.value;
        });
        return values;
    }).toArray();
    return map;
}

sumQtdAdicionada = (id) => {
    let qtd_adicionada = 0;
    $('.produto-id-adicionado-' + id).find('.produto-qtd-adicionado').each(function (e, item) {
        qtd_adicionada += parseInt($(item).val());
    });
    return qtd_adicionada;
}

createSelectCliente = () => {
    let options = '<option value="">Selecione...</option>';
    $.each(returnClientes(), function (index, element) {
        options += '<option value="' + element.id + '">' + element.nome + '</option>';
    });
    $('#cliente').html(options);
}

addProduto = (produto) => {
    let html = '';
    html += '<tr class="produto-id-adicionado-' + produto.id + '">';
    html += '<td>' + produto.descricao + '';
    html += '<input type="hidden" class="produto-id-adicionado" name="produto_id" value="' + produto.id + '" >'
    html += '<input type="hidden" class="produto-qtd-adicionado" name="qtd" value="' + $('#quantidade').val() + '" >'
    html += '<input type="hidden" class="produto-desconto"  name ="desconto" value="' + $('#desconto').maskMoney('unmasked')[0] + '" >'
    html += '</td>';
    html += '<td>' + $('#quantidade').val() + '</td>';
    html += '<td>R$ ' + numberToReal(produto.preco) + '</td>';
    html += '<td>' + $('#desconto').val() + '</td>';
    html += '</tr>';

    $('.produtos-adicionados').append(html);
}

appendCardProduto = () => {
    $.each(returnProdutos(), function (index, element) {
        createCardProduto(element);
    });
}

createCardProduto = (produto) => {
    let html = '';
    html += '<div class="col-md-3">'
    html += '<div class="card" >'
    html += '<div class="card-body card-body-top">'
    html += '<h5 class="card-title">' + produto.descricao + '</h5>'
    html += '<input type="hidden" class="produto-id" value="' + produto.id + '"'
    html += '</div>'
    html += '<ul class="list-group list-group-flush">'
    html += '<li class="list-group-item produto-qtd-' + produto.id + '">Quantidade: ' + produto.quantidade + '</li>'
    html += '<li class="list-group-item">Preço: R$ ' + numberToReal(produto.preco) + '</li>'
    html += '<li class="list-group-item">Desconto: R$ ' + numberToReal(produto.desconto) + '</li>'
    html += '</ul>'
    html += '<div class="card-body">'
    html += '<a class="btn btn-primary btn-xs selecionar-produto">Selecionar Produto</a>'
    html += '</div>'
    html += '</div>'
    html += '</div>';
    $('#produtos').append(html);
}


validateFormPedido = () => {
    let ul = $('.alert-form');
    ul.find('ul').html('');
    ul.addClass('d-none');

    let cliente = $('#cliente').val();
    let len_produtos = $('.produtos-adicionados').find('tr').length;
    let msg = '';

    if (cliente == '') {
        msg += '<li> O campo "Cliente" deve ser preenchido</li>';
    }

    if (len_produtos <= 0) {
        msg += '<li>É necessário ao menos um produto adicionado</li>';
    }

    if (msg == '') {
        return true;
    } else {
        ul.find('ul').html(msg);
        ul.removeClass('d-none');
    }
    window.location = '#erro';
    return false;
}

insertOnStorage = (dataToStorage) => {
    if (localStorage.hasOwnProperty("pedido")) {
        localStorage.removeItem('pedido');
    }
    localStorage.setItem("pedido", JSON.stringify(dataToStorage))
}

constructJsonPedido = () => {
    let json = {
        pedido_id: 1,
        cliente_id: $('#cliente').val(),
        produtos: getAllProdutosAsJson()
    }
    return json;
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