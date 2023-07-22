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
   
    `
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