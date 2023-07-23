$(document).ready(function() {
    $('.nav-link-collapse').on('click', function() {
        $('.nav-link-collapse').not(this).removeClass('nav-link-show');
        $(this).toggleClass('nav-link-show');
    });
});




function logout() {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    console.log("Usuário deslogado.");
    location.href = '/'
}


function home() {



    const data = {
        token: sessionStorage.getItem("token"),

    };
    sendData(data);



}

async function sendData(data) {
    try {
        const response = await fetch("/api/marloscardoso/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();


        if (result.message == 'Token Valido') {
            console.log("Token Valido")
        } else {
            location.href = '/'
        }
    } catch (error) {
        console.error("Erro ao enviar dados para o servidor", error);
    }

}


function pagehome() {
    document.querySelector('.content-wrapper').innerHTML = `
    <h1>Home</h1>
    `
}


function pedidos() {
    document.querySelector('.content-wrapper').innerHTML = `
    <h1>Pedidos</h1>
    <input id="searchInput" oninput="filterTable()" type="search" autocomplete="off" class="input form-control" placeholder="Pesquise aqui">
    <table>
        <thead>
            <tr>
               <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Produto</th>
                <th>Telefone</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody id="list-pedidos">
           
            <!-- Adicione mais linhas aqui para mais pedidos -->
        </tbody>
    </table>
    `
    fetch('http://192.168.1.114/api/marloscardoso/listapedidos')
        .then(response => response.json())
        .then(data => {

            data.forEach(item => {

                var newRow = $("<tr>");
                newRow.append($("<td>").text(item._id));
                newRow.append($("<td>").text(item.firstNameInput));
                newRow.append($("<td>").text(item.cpf));

                item.pedido.forEach(pedido => {
                    const div = $('<div>')
                    div.append($("<td>").text(pedido.title));
                    newRow.append(div)
                })
                newRow.append($("<td>").text(item.phoneInput));
                const btn = document.createElement("button")
                btn.textContent = 'Detalhes'

                newRow.append($("<td>").on("click", function() {
                    const Modal = $("#ModalPedido");

                    // Abra o modal usando o método modal()
                    Modal.modal("show");

                    document.querySelector("#listapedidos").innerHTML = ''
                    item.pedido.forEach(pedido => {

                        const pedidoDetails = $('#listapedidos');

                        // Cria o elemento HTML usando jQuery
                        const card = $('<div class="card mb-3">');
                        const row = $('<div class="row g-0">');
                        const imgDiv = $('<div class="col-md-4 divImg">');
                        const img = $('<img class="img-fluid" id="img-pedido" alt="">').attr('src', pedido.image);
                        imgDiv.append(img);

                        const cardBody = $('<div class="col-md-8">');
                        const cardBodyContent = $('<div class="card-body">');
                        const cardTitle = $('<h5 class="card-title" id="pedido-title">').text(pedido.title);
                        const cardDescription = $('<p class="card-text" id="pedido-description">').text(pedido.descricao);
                        const cardPrice = $('<p class="card-text" id="pedido-price">').text('Valor: R$ ' + pedido.price);

                        cardBodyContent.append(cardTitle, cardDescription, cardPrice);
                        cardBody.append(cardBodyContent);
                        row.append(imgDiv, cardBody);
                        card.append(row);

                        // Adiciona o elemento criado na div #list-cards
                        pedidoDetails.append(card);


                    })





                    document.querySelector("#price").innerHTML = 'Valor Total: R$' + item.pricetotal
                    document.querySelector("#nomeCompleto").value = item.firstNameInput + ' ' + item.lastNameInput
                    document.querySelector("#cpf").value = item.cpf
                    document.querySelector("#telefone").value = item.phoneInput
                    document.querySelector("#email").value = item.emailInput
                    document.querySelector("#TituloProduct").innerHTML = item._id
                    document.querySelector("#endereco").value = item.addressInput + ', ' + item.addressAltInput + ', ' + item.cityInput + ', ' + item.stateInput


                    document.querySelector("#dataHoraPedido").value = item.data


                }).attr("class", "btndetalhes").text('Detalhes'));

                // Adicionar a nova linha à tabela (myTable)
                $("#list-pedidos").append(newRow);

            })
        })
}

function produtos() {
    document.querySelector('.content-wrapper').innerHTML = `
    <div class="flex menuhorizontal">
    <div onclick="addproduto()" class="item-menu"><i class="fas fa-plus"></i></div>
    <div class="item-menu" onclick="listprodutos()"><i class="fas fa-list"></i></div>
    <div></div>
    <div></div>
    </div>
   
    `
}

function categorias() {
    document.querySelector('.content-wrapper').innerHTML = `
    <div class="flex menuhorizontal">
    <div onclick="addcategoria()" class="item-menu"><i class="fas fa-plus"></i></div>
    <div class="item-menu" onclick="listcategorias()"><i class="fas fa-list"></i></div>
    <div></div>
    <div></div>
    </div>
   
    `
}

function clientes() {
    document.querySelector('.content-wrapper').innerHTML = `
    <div class="flex menuhorizontal">
    
    <div class="item-menu" onclick="verclientes()"><i class="fas fa-list"></i></div>
    <div></div>
    <div></div>
    </div>
    `
}

function perfil() {
    document.querySelector('.content-wrapper').innerHTML = `
   
    `
}