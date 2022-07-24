document.addEventListener("DOMContentLoaded", function(){
    iniciarApp(); //se llama a la funcion de abajo, la cual llama a las demas funciones de este documento
});

//se llaman a las funciones que estan funcionando en nuestra página
function iniciarApp(){
    navegacionFija();
    crearGaleria();
    scrollNav();
}

//funcion para que la barra de navegacion esté fija
function navegacionFija(){
    const barra = document.querySelector(".header"); //seleccionamos toda la barra del header
    //vamos a seleccionar un elemento el cual una vez le hemos dado scroll a ese elemento, se aplicara este codigo
    const sobreFestival = document.querySelector(".sobre-festival");

    //esto es para fijar la barra, ya que al moverse de su posicion original, hay un pequeño cambio en la posicion de los objetos de la pagina
    const body = document.querySelector("body");


    //para saber que ya hemos pasado ese elemento con el scroll usaremos lo siguiente
    window.addEventListener("scroll", function(){ //estaremos escuchando por un accion de scrrol en todo nuestro archivo
        console.log(sobreFestival.getBoundingClientRect());

        if( sobreFestival.getBoundingClientRect().top < 0){//este if nos dice que ya nos hemos pasado de la parte inferior del elemento, es decir, estamo abajo del final del div de la parte de sobre festival, o viendolo de otra forma, la barra del buscador del navegador a choocado o ha pegado con esa seccion del div
            // console.log("ya pasamos el elemento");
            barra.classList.add("fijo");
            body.classList.add("body-scroll"); // esto es para para fijar el body cuando apaarece la barra de navegacion fija
        }
        else{ //de lo contrario entonces no hemos pasado ese div, y por consecuencia no es necesaria la clase fijo ni la clase body-scroll
            // console.log("aun no")
            barra.classList.remove("fijo");
            body.classList.remove("body-scroll");
        }
    });

    

}


//funcion para el scrollNav
function scrollNav(){
    const enlaces= document.querySelectorAll(".navegacion-principal a"); //seleccionarmos todos los enlaces de la navegacion principal
    enlaces.forEach(enlace => { //para cada uno de los enlaces
        enlace.addEventListener("click",function(e){
            e.preventDefault(); //prevenimos la accion por default, la cual es que vayamos de golpe a la seccion, ya que queremos hacer un desplazamiento suave
            //al dar click en el enlace

            // console.log(e.target.attributes);
            const seccionScroll = e.target.attributes.href.value; //agregamos una variable que almacenara el elemento href de nuestros enlaces
            const seccion = document.querySelector(seccionScroll);
            seccion.scrollIntoView({behavior: "smooth"}); //esta es una funcion que es parte de una appi de javaScript
            //gracias al scrillIntoView podemos cambiar el comportamieno a suave, que es smooth
        });
    });
}


//funcion para inyectar html repetitivo el cual es de la galeria, creado con javaScript
function crearGaleria(){
    const galeria = document.querySelector(".galeria-imagenes");
    //con este for inyectaremos todas las imagenes gracias a createElement y a su propiedad innerHTML
    for(let i=1 ; i<=12 ; i++){
        const imagen = document.createElement("picture"); //se crearan 12 pictures gracias al for

        //con innerHTML inyectaremos el codigo html que creara esas imagenes
        imagen.innerHTML = `
            <source srcset="build/img/thumb/${i}.avif" type="image/avif">
            <source srcset="build/img/thumb/${i}.webp" type="image/webp">
                
            <img loading="lazy" width="200" height="300" src="build/img/thumb/${i}.jpg" alt="imagen galeria">
        `;

        imagen.onclick = function(){ //funcion que se llamara cuando se dio click en una de las imagenes
            mostrarImagen(i); //mandamos a llamar a la funcion mostrar imagen
        }
        // console.log(imagen);
        galeria.appendChild(imagen); //aqui decimos que agregaremos a la variable galeria que 
        //habiamos seleccionado previamente con querySelector, le agregaremos cada una de las imagenes
        //que estan siendo generadas por medio del for
    }
}

//funcion para mostrar la imagen grande junto con su overlay
function mostrarImagen(id){
    const imagen = document.createElement("picture");
    //aqui abajo se crearan las imagenes tanto avif como webp como jpg, para la imagen que hemos seleccionado en la galeria
    imagen.innerHTML= `
        <source srcset="build/img/grande/${id}.avif" type="image/avif">
        <source srcset="build/img/grande/${id}.webp" type="image/webp">
            
        <img loading="lazy" width="200" height="300" src="build/img/grande/${id}.jpg" alt="imagen galeria">
    `;

    //oscureciendo la pantalla mientras esta abierta la imagen grande, eso se hace con un overlay
    //primero crearemos nuestro overlay y le agregaremos nuestra imagen grandota
    const overlay = document.createElement("DIV");
    overlay.appendChild(imagen); //le agregamos la imagen al overlay
    overlay.classList.add("overlay");//creamos la clase overlay para poder modificarlo con css
    //para cerrar la imagen si se presiona en cualquier lado de la pagina
    overlay.onclick= function (){
        const body= document.querySelector("body");
        body.classList.remove("fijar-body");
        overlay.remove();
    }

    //boton para cerrar el modal
    const cerrarModal = document.createElement("P");
    cerrarModal.textContent = "X";
    cerrarModal.classList.add("btn-cerrar"); //creamos una clase para modificarla con css
    //funcion para cuando se presiona el boton de cerrar
    cerrarModal.onclick = function(){
        const body= document.querySelector("body");
        body.classList.remove("fijar-body");
        overlay.remove();
    };
    overlay.appendChild(cerrarModal); // le agregamos al overlay nuestro cerrador de imagen

    //agregamos nuestro overlay a nuestro body
    const body= document.querySelector("body");
    body.appendChild(overlay);
    body.classList.add("fijar-body"); //creamos una clase para poder fijar el body en los globales
}