// Llamado AJAX para acceder a los datos del json
$.ajax({
    method: 'GET',
    url: 'https://belenyb.github.io/basscustomizr/basses.json',
    dataType: 'json',
}).done(function (d) {
    customBasses = d;
}).fail(function () {
    alert('Hubo un problema, por favor vuelva a intentarlo.');
})

// Constantes del DOM
const $selectColor = $('#color');
const $selectBody = $('#body');
const $selectPickup = $('#pickup');
const $selectPickguard = $('#pickguard');

// Función que carga los select en base a los datos del array
function loadSelect(selectInput, dataArray) {
    for (index in dataArray) {
        selectInput.append(new Option(dataArray[index][0], dataArray[index][0]));
    }
}

// Función que se ejecuta al cargarse el DOM
$(document).ready( () => {
    // Elige valores de un bajo seleccionado por defecto
    $("#color").val('Madera');
    $("#body").val('PH');
    $("#pickup").val('Precision');
    $("#pickguard").val('Blanco');
    // Rellena el modal para poder reservar el bajo por defecto
    $modalChosenBass.html(`
        <ul class="p-0">
            <li><i class="fas fa-bolt"></i> Color: Madera.</li>
            <li><i class="fas fa-bolt"></i> Cuerpo: PH.</li>
            <li><i class="fas fa-bolt"></i> Micrófonos: Precision.</li>
            <li><i class="fas fa-bolt"></i> Pickguard: Blanco.</li>
            <li class="font-weight-bold"><i class="fas fa-star"></i> Total: USD 2765</li>
            <img src="images/combinations/Madera-PH-Precision-Blanco.jfif" class="w-100">
        </ul>
    `);
    // Ejecuta la función que carga los select en base a los datos del array
    loadSelect($selectColor, colors);
    loadSelect($selectBody, bodies);
    loadSelect($selectPickup, pickups);
    loadSelect($selectPickguard, pickguards);
});

// Funcion que recibe el nombre del usuario y lo muestra en el index y el modal. Se ejecuta al capturar "enter"

const $usernameInputText = $("#usernameInputText");
const $usernameCompleted = $("#usernameCompleted");

$usernameInputText.on('keypress', function capturarEnter(e) {
    if (e.which === 13 || e.keyCode === 13) {
        let usernameInputTextValue = $usernameInputText.val();
        let usernameCapitalized = usernameInputTextValue.charAt(0).toUpperCase() + usernameInputTextValue.slice(1);
        $usernameCompleted.text(usernameCapitalized);
        // Para completar el modal
        if (usernameCapitalized !== '') {
            $('#modalSpan').text(usernameCapitalized);
        }
        $usernameInputText.hide();
    }
});

// Función que suma el precio total
const manufacturePrice = 2500;
let colorPrice = 0;
let bodyPrice = 0;
let pickupPrice = 0;
let pickguardPrice = 0;
let totalPrice = 0;

const $totalPrice = $('#totalPrice');

function sumTotal() {
    totalPrice = manufacturePrice + colorPrice + bodyPrice + pickupPrice + pickguardPrice;
    $totalPrice.text(totalPrice);
}

// Función que captura las selecciones del usuario
function colorChoice() {
    // Suma el precio parcial
    colors.forEach((value) => {
        if (value[0] === $selectColor.val()) {
            colorPrice = value[1];
            sumTotal();
        }
    });
    return $selectColor.val();
}

function bodyChoice() {
    bodies.forEach((value) => {
        if (value[0] === $selectBody.val()) {
            bodyPrice = value[1];
            sumTotal();
        }
    });
    return $selectBody.val();
}

function pickupChoice() {
    pickups.forEach((value) => {
        if (value[0] === $selectPickup.val()) {
            pickupPrice = value[1];
            sumTotal();
        }
    });
    return $selectPickup.val();
}

function pickguardChoice() {
    pickguards.forEach((value) => {
        if (value[0] === $selectPickguard.val()) {
            pickguardPrice = value[1];
            sumTotal();
        }
    });
    return $selectPickguard.val();
}

// Eventos 'on change' que se ejecutan al cambiar el valor del select
$selectColor.on('change', getFullBass);
$selectBody.on('change', getFullBass);
$selectPickup.on('change', getFullBass);
$selectPickguard.on('change', getFullBass);

// Función que arma el bajo en base a las selecciones del usuario, y luego muestra la imagen correspondiente
let selectedBass = {};

function getFullBass() {
    chosenBass();
    getBassImg();
}

function chosenBass() {
    selectedBass = {
        "color": colorChoice(),
        "body": bodyChoice(),
        "pickup": pickupChoice(),
        "pickguard": pickguardChoice()
    }
}

const $modalChosenBass = $('#modalChosenBass');

getBassImg = function () {
    customBasses.forEach(customBass => {
        if (JSON.stringify(customBass) === JSON.stringify(selectedBass)) {
            const chosenBassImg = `images/combinations/${selectedBass.color}-${selectedBass.body}-${selectedBass.pickup}-${selectedBass.pickguard}.jfif`;
            $('#imgSrc').attr('src', chosenBassImg);
            // Para mostrar los datos del bajo personalizado en el modal
            $modalChosenBass.html(`
                <ul class="p-0">
                    <li><i class="fas fa-bolt"></i> Color: ${selectedBass.color}.</li>
                    <li><i class="fas fa-bolt"></i> Cuerpo: ${selectedBass.body}.</li>
                    <li><i class="fas fa-bolt"></i> Micrófonos: ${selectedBass.pickup}.</li>
                    <li><i class="fas fa-bolt"></i> Pickguard: ${selectedBass.pickguard}.</li>
                    <li class="font-weight-bold"><i class="fas fa-star"></i> Total: USD ${totalPrice}</li>
                    <img src=${chosenBassImg} class="w-100">
                </ul>
            `);
        }
    });
}

// Animación para el botón de Reservar
const $reservar = $('#btnReservar');
$reservar.on('click', pedirReserva);

function pedirReserva(e) {

    e.preventDefault();
    $modalChosenBass.empty();

    // Mostrar el spinner (oculto con css, display: none;)
    const $spinner = $('#spinner');
    $spinner.show();

    // Después de 2 segundos (2000), ocultar el spinner y mostrar el mensaje
    setTimeout(() => {
        $spinner.hide();

        // Mensaje que dice que el bajo se reservó correctamente
        $reservaCreada = $('<p></p>');
        $reservaCreada.html("La reserva se realizó correctamente <i class='far fa-check-circle'></i>");
        $reservaCreada.css({'color': 'green', 'text-align': 'center', 'font-weight': 700, 'margin-top': '16px'});

        // Insertamos el mensaje en el modal
        $('.modal-body').append($reservaCreada);

    }, 2000);

}



/*function colorChoice() {
    colors.forEach((value) => {
        if (value[0] === selectColor.val()){
            colorPrice = value[1]; //return [selectColor.val(), value[1]];
            sumTotal()
        }
    })
    console.log(totalPrice)
    return selectColor.val()
}*/

