const Key = "b42de55b0d904d6b86950add49f61d34"

let currentPage = 1;
const PAGE_SIZE = 6;
let totalPages = 1;
let isLoading = false;
let currentCategory = "general";


const innercard = document.getElementById('inner-card');
const card = document.getElementById('cards');
const loader = document.getElementById('loader')
const navlist = document.querySelectorAll('.nav-item')




// this function is fetching data from Api
const FetchData = async (page, currentCategory) => {

  if (isLoading) return;
  isLoading = true;
  loader.classList.remove('hidden')


  try {
    let api = `https://newsapi.org/v2/top-headlines?country=us&category=${currentCategory}&page=${page}&pageSize=${PAGE_SIZE}&apiKey=${Key}`
    let response = await fetch(api)
    let data = await response.json()

    totalPages = Math.ceil(data.totalResults / PAGE_SIZE)

    Render(data.articles)
    // updateControls()
  }
  catch {
    console.error('fetcing is successd but dom milead...')
  }
  finally {
    isLoading = false;
    loader.classList.add('hidden')
  }
}


// this is rendring cards

const Render = (articles) => {

  // innercard.innerHTML = ""

  articles.forEach(val => {

    const cards = card.cloneNode(true);
    cards.classList.remove('hidden')

    cards.querySelector('img').src = val.urlToImage ? val.urlToImage : "/naruto.jpg";
    cards.querySelector('h4').innerHTML = val.title;
    cards.querySelector('p').innerHTML = val.description ? val.description : "empty details";
    cards.querySelector('a').href = val.url;

    innercard.append(cards);
  });
}


// navigate the news category wise
navlist.forEach(function (item) {

  item.addEventListener("click", function () {

    navlist.forEach(i =>
      i.classList.remove("bg-indigo-500", "text-white", "scale-105")
    );

    item.classList.add("bg-indigo-500", "text-white", "scale-105");

    //when you navigate using category every time news fetch on currentPage 1
    currentPage = 1;
    totalPages = 1;
    innercard.innerHTML = "";

    currentCategory = item.innerText;
    FetchData(currentPage, currentCategory);

  });

})

const infinitScroll = () => {
  window.addEventListener("scroll", () => {
    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight * 0.9;

    if (scrollPos >= threshold && !isLoading && currentPage < totalPages) {
      currentPage++;
      FetchData(currentPage, currentCategory);
    }
  });
}


// Go bact to the previous page
// const Prevpage = () => {

//   if (currentPage <= 1) return;
//   currentPage--
//   FetchData(currentPage, currentCategory);
// }

// Go to the next page
// const Nextpage = () => {

//   if (currentPage >= totalPages) return;
//   currentPage++
//   FetchData(currentPage, currentCategory);

// }

// this is for disabling or bg-color change to button if below the condition are satisfied
// function updateControls() {
//   let prev = document.getElementById("Prev")
//   prev.disabled = currentPage === 1;
//   if (currentPage == 1 ? prev.style.background = "darkgray" : prev.style.background = "black");


//   let next = document.getElementById("Next");
//   next.disabled = currentPage === totalPages;
//   if (currentPage === totalPages ? next.style.background = "darkgray" : next.style.background = "black");
// }

const goBacktoTop = () => {
  const backToTop = document.getElementById("backToTop");

  // Show button when scrolling down
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.remove("hidden");
      backToTop.classList.add("opacity-100");
    } else {
      backToTop.classList.add("hidden");
    }
  });

  // Smooth scroll to top
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

};


document.addEventListener("DOMContentLoaded", () => {
  FetchData(currentPage, currentCategory);
  infinitScroll()
  goBacktoTop()
});