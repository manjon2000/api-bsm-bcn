let arrayParking = [];
let marker = [];
let map;
let countError = [];
let valorMostarMapa;
let arg = {};
let amount = [];
let filteritem = [];
let filr;
let container = document.querySelector('container');
let containerItems = document.querySelector('.lista__items');
let openFilter = document.getElementById('filter-open')
let filterOpen = document.querySelector('.container__filter')
let iconsfilter = document.querySelectorAll('.itemfilter')
let iconossailtro = document.getElementById('appAgilpark')

iconsfilter.forEach(element => {
    element.addEventListener('click', function () {
        element.classList.toggle('actived');
        let found = filteritem.find(element => element.nombre === $(this).attr('id'));
        // console.log(found)
        if (found) {
            let valor = $(this).attr('id');
            var indiceItem = filteritem.findIndex((objeto, indice, filteritem) => {
                return objeto.nombre == valor;
            })
            if (indiceItem === 0) {
                filteritem.shift();
                // console.log("Shifteando")
            } else {
                filteritem.splice(indiceItem);
                
            }
        } else {
            filteritem.push({ "nombre": $(this).attr('id') });
            
        }
        filtrado(filteritem);
    })
});

openFilter.addEventListener('click', function (e) {
    filterOpen.classList.toggle('slider__filter')
})

const datosParking = () => {
    fetch('https://api.bsmsa.eu/ext/api/Aparcaments/ParkingService/Parkings/v3/ParkingDataSheet')
        .then(respuesta => respuesta.json())
        .then(callRequest => {
            // console.log(callRequest)
            for (var i in callRequest.ParkingList.Parking) {
                arrayParking.push([callRequest.ParkingList.Parking[i]])
            }
            for (var e in arrayParking) {
                if (arrayParking[e][0].ParkingAccess == null) {
                    // console.log('El elemento no tiene Access');
                } else {
                    var size = Object.keys(arrayParking[e][0].ParkingAccess.Access).length;
                    if (size <= 2) {
                        // console.log('Tiene otros 2 arrays dentro')
                        arg[e] = { "lat": arrayParking[e][0].ParkingAccess.Access[0].Latitude, "lng": arrayParking[e][0].ParkingAccess.Access[0].Longitude };
                    } else if (size >= 4) {
                        // console.log('No contiene ningun array')
                        arg[e] = { "lat": arrayParking[e][0].ParkingAccess.Access.Latitude, "lng": arrayParking[e][0].ParkingAccess.Access.Longitude };
                    }
                }
            }

            initMap(arg);
            imprimirDatos(arrayParking);
            // $('.items__parkings').on("click",function (e) {
            //     this.lastElementChild.classList.toggle('open_desplegable')
            //     valorMostarMapa = $(this).attr("id")
            //     mostrarParking($(this).attr("id"));
            // });
            

        }) // Fin de la peticion
}

// function clickItems(){
//     $('.items__parkings').on("click",function (e) {
//         this.lastElementChild.classList.toggle('open_desplegable')
//         valorMostarMapa = $(this).attr("id")
//         mostrarParking($(this).attr("id"));
//     });
// }

function imprimirDatos(datos) {
    
    var w;
    let precio = [];
    let resultado;
    for (w in datos) {
        // console.log(datos[w][0])

        if (datos[w][0].ParkingPriceList == null) {
            precio.push([
                'no disponible'
            ]);
        } else {
            var sizeObj = Object.keys(datos[w][0].ParkingPriceList.Price).length;
            if (sizeObj > 4) {

                precio.push([
                    (datos[w][0].ParkingPriceList.Price.Amount)
                ])
            } else if (sizeObj <= 3) {
                //  price = datos[w][0].ParkingPriceList.Price[0].Amount;

                precio.push([
                    (datos[w][0].ParkingPriceList.Price[1].Amount)
                ])
            }
        }
        containerItems.innerHTML += `<div id="${w}" class="items__parkings">
             <div class="title__item">
                        <h3>${datos[w][0].Name}.</h3>
                        <i class="fas fa-chevron-circle-down"></i>
            </div>
                    <div class="desplegable__item">
                        <ul>
                            <li>
                                <h2>Informacion sobre el parking:</h2>
                            </li>
                            <li>
                                <div class="icon_circle">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <p>${datos[w][0].Open} - ${datos[w][0].Close}</p>
                            </li>
                            <li>
                                <div class="${isNaN(precio[w]) ? 'disable icon_circle' : 'icon_circle'}">
                                    <i class="fas fa-euro-sign"></i>
                                </div>
                                <p>Precio <span class="${isNaN(precio[w]) ? 'text-bold text-error' : 'text-bold text-success'}">${isNaN(precio[w]) ? ' no disponible' : Math.ceil(precio[w] * 60) + '€' + '/h'}</span></p>
                            </li>
                            <li>
                                <div class="${datos[w][0].HandicapAccess === 0 ? 'disable icon_circle' : 'icon_circle'}">
                                    <i class="fas fa-wheelchair"></i>
                                </div>
                                <p>Accesible para discapacitados <i  class="${datos[w][0].HandicapAccess === 0 ? 'text-error fas fa-times' : 'text-success fas fa-check'}"></i></p>
                            </li>
                            <li>
                                <div class="${datos[w][0].ElectricCharger === 0 ? 'disable icon_circle' : 'icon_circle'}">
                                    <i class="fas fa-battery-full"></i>
                                </div>
                                <p>Cargador para coches electricos <i  class="${datos[w][0].ElectricCharger === 0 ? 'text-error fas fa-times' : 'text-success fas fa-check'}"></i></p>
                            </li>
                            <li>
                                <div class="${datos[w][0].WC == 1 ? 'icon_circle' : 'disable icon_circle'}">
                                    <i class="fas fa-toilet"></i>
                                </div>
                                <p>WC <i class="${datos[w][0].WC == 1 ? 'text-success fas fa-check' : 'text-error fas fa-times'}"></i></p>
                            </li>
                            <li>
                            <div class="${datos[w][0].Consigna == 1 ? 'icon_circle' : 'disable icon_circle'}">
                                <i class="fas fa-door-closed"></i>
                            </div>
                            <p>Taquilla <i class="${datos[w][0].Consigna == 1 ? 'text-success fas fa-check' : 'text-error fas fa-times'}"></i></p>
                        </li>
                        <li>
                            <div class="${datos[w][0].Carsharing == 1 ? 'icon_circle' : 'disable icon_circle'}">
                                <i class="fas fa-car"></i>
                            </div>
                            <p>Alquiler de Coche <i class="${datos[w][0].Carsharing == 1 ? 'text-success fas fa-check' : 'text-error fas fa-times'}"></i></p>
                        </li>
                        <li>
                            <div class="${datos[w][0].appAgilpark == 1 ? 'icon_circle' : 'disable icon_circle'}">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <p>App Agilpark <i class="${datos[w][0].appAgilpark == 1 ? 'text-success fas fa-check' : 'text-error fas fa-times'}"></i></p>
                        </li>
                        </ul>
    
                    </div>
                </div>`;
    }
    $('.items__parkings').on("click",function (e) {
        this.lastElementChild.classList.toggle('open_desplegable')
        console.log(this.lastElementChild.attributes.class.nodeValue)
        valorMostarMapa = $(this).attr("id")
        mostrarParking($(this).attr("id"));
    });
    
}

function mostrarDatos(datos){
    arg = [];
    console.log(datos)
    containerItems.innerHTML = ""
    imprimirDatos(datos)
    for (var e in datos) {
        if (arrayParking[e][0].ParkingAccess == null) {
            // console.log('El elemento no tiene Access');
        } else {
            var size = Object.keys(arrayParking[e][0].ParkingAccess.Access).length;
            if (size <= 2) {
                // console.log('Tiene otros 2 arrays dentro')
                arg[e] = { "lat": arrayParking[e][0].ParkingAccess.Access[0].Latitude, "lng": arrayParking[e][0].ParkingAccess.Access[0].Longitude };
            } else if (size >= 4) {
                // console.log('No contiene ningun array')
                arg[e] = { "lat": arrayParking[e][0].ParkingAccess.Access.Latitude, "lng": arrayParking[e][0].ParkingAccess.Access.Longitude };
            }
        }
    }
    initMap(arg)
}

function filtrado(filtro) {

        console.log(filtro)
        let arrayClone = [...arrayParking];
        filr = []
        for(var o in filtro){
            console.log(filtro[o]["nombre"])
            filr = arrayClone.filter(elemento => elemento[0][filtro[o]["nombre"]] === 1);
        }
        mostrarDatos(filr)
        // console.log(filr)

    }
datosParking();
let e;
function initMap(argumento) {
    const myLatLng = { lat: 41.3879, lng: 2.16992 };
    if (argumento === undefined) {
        // console.log('El elemento esta vacio')
    } else {
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: myLatLng,
        });
        let i = -1;
        let img = 'img.png';
        for (i in argumento) {
            marker[i] = new google.maps.Marker({
                position: new google.maps.LatLng(
                    argumento[i]),
                title: i,
                icon: img
            });
            marker[i].setMap(map)
        }
    }
}



function mostrarParking(elemento) {

    // console.log(elemento)
    map.setZoom(18);
    map.setCenter(marker[elemento].getPosition());

}



