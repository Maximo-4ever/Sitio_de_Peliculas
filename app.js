let pagina = 1;
let peliculas = "";
let ultimaPelicula;

//observador
const observador = new IntersectionObserver(
  (entradas, observador) => {
    console.log(entradas);
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        pagina++;
        cargarPeliculas();
      }
    });
  },
  {
    rootMargin: "0px 0px 100px 0px",
    threshold: 1.0,
  }
);

const cargarPeliculas = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=17ff17d89be5b5474b5a7b447dd5872e&language=es-MX&page=${pagina}`
    );
    if (res.status === 200) {
      const data = await res.json();
      //Pintar peliculas si no todo salio bien
      data.results.forEach((pelicula) => {
        peliculas += //html
        `
        <div class="pelicula">
            <img src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" class="poster" />
            <h3 class="titulo">${pelicula.title}</h3>
        </div>
        `;
      });
      document.getElementById("contenedor").innerHTML = peliculas;
      
      //Obtener la ultima pelicula y llamar al observador
      if (pagina < 1000) {
        if (ultimaPelicula) observador.unobserve(ultimaPelicula);
        const peliculasEnPantalla = document.querySelectorAll(".pelicula");
        ultimaPelicula = peliculasEnPantalla[peliculasEnPantalla.length - 1];
        observador.observe(ultimaPelicula);
      }

      //Si hay algun error...
    } else if (res.status === 401) {
      console.log("Key erronea.");
    } else if (res.status === 404) {
      console.log("Pelicula no encontrada.");
    } else {
      console.log("Ocurrio un error inesperado.");
    }
  } catch (error) {
    console.log(error);
  }
};
cargarPeliculas();
