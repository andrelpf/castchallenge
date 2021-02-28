
$(document).ready(function () {
    let resume = returnResumeAsJson();
    insertCliente(resume.cliente);
    insertValores(resume);
    insertProdutos(resume.produtos);
});

insertCliente = (cliente) => {
    $('.nome').html('Nome: ' + cliente.nome);
    $('.cpf').html('CPF: ' + cliente.cpf);
    $('.genero').html('Gênero: ' + returnGenero(cliente.genero));
    $('.endereco').html('Endereço: ' + cliente.endereco);
}

insertValores = (resume) => {
    $('.valor-total').html('Valor total da venda bruto: R$ ' + numberToReal(resume.total));
    $('.valor-liquido').html('Valor total da venda com desconto: R$ ' + numberToReal(resume.liquido));
}

returnGenero = (genero) => {
    switch (genero) {
        case 'M':
            return 'Masculino';
            break;
        case 'F':
            return 'Feminino';
            break;
        case 'O':
            return 'Outros';
            break;

    }
}

insertProdutos = (produtos) => {
    let html = '';
    $.each(produtos, function (i, produto) {
        html += '<tr>';
        html += '<td>' + produto.produto_id + '</td>';
        html += '<td>' + produto.descricao + '</td>';
        html += '<td>' + produto.qtd + '</td>';
        html += '<td>R$ ' + numberToReal(produto.preco) + '</td>';
        html += '<td>R$ ' + numberToReal(produto.preco_desconto) + '</td>';
        html += '</tr>';
    })
    $('.produtos-adicionados').append(html);
}

returnPedido = () => {
    let json;
    json = JSON.parse(localStorage.getItem("pedido"));
    return json;
}

returnResumeAsJson = () => {
    let pedido = returnPedido();
    let produtos = createProdutosResumo(pedido.produtos);
    let totais = getTotalPedido(produtos);
    let json = {
        cliente: returnCliente(pedido.cliente_id),
        produtos: produtos,
        total: totais.total,
        liquido: totais.liquido
    }
    return json;
}

createProdutosResumo = (produtos) => {
    return produtos.map(function (produto) {
        let original = returnProduto(produto.produto_id);
        return {
            produto_id: produto.produto_id,
            descricao: original.descricao,
            preco: original.preco,
            preco_desconto: original.preco - parseFloat(produto.desconto),
            desconto: produto.desconto,
            total: (original.preco) * produto.qtd,
            total_desconto: (original.preco - parseFloat(produto.desconto)) * produto.qtd,
            qtd: produto.qtd
        }
    });
}

getTotalPedido = (produtos) => {
    let total = 0;
    let liquido = 0;
    $.each(produtos, function (index, item) {
        total += item.total;
        liquido += item.total_desconto;
    });

    return {
        total: total,
        liquido: liquido
    }
}