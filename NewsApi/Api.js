const Key = "b42de55b0d904d6b86950add49f61d34"

let currentPage = 1;
const PAGE_SIZE = 6;
let totalPages = 1;
let isLoading = false;


const innercard = document.getElementById('inner-card');
const card = document.getElementById('cards');
const loader = document.getElementById('loader')


// this function is fetching data from Api
const FetchData = async (page) => {

  if (isLoading) return;
  isLoading = true;
  loader.classList.remove('hidden')


  try {
    let api = `https://newsapi.org/v2/top-headlines?country=us&page=${page}&pageSize=${PAGE_SIZE}&apiKey=${Key}`
    let response = await fetch(api)
    let data = await response.json()

    totalPages = Math.ceil(data.totalResults / PAGE_SIZE)

    Render(data.articles)
    updateControls()
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

  innercard.innerHTML = ""

  articles.forEach(val => {

    const cards = card.cloneNode(true);
    cards.classList.remove('hidden')

    cards.querySelector('img').src = val.urlToImage ? val.urlToImage : "/Api/naruto.jpg";
    cards.querySelector('h4').innerHTML = val.title;
    cards.querySelector('p').innerHTML = val.description ? val.description : "empty details";
    cards.querySelector('a').href = val.url;

    innercard.append(cards)


  });
}



// Go bact to the previous page
const Prevpage = () => {

  if (currentPage <= 1) return;
  currentPage--
  FetchData(currentPage);
}

// Go to the next page
const Nextpage = () => {

  if (currentPage >= totalPages) return;
  currentPage++
  FetchData(currentPage);
  console.log('page', currentPage)

}

// this is for disabling button if below condition are satisfied
function updateControls() {
  document.getElementById("Prev").disabled = currentPage === 1;
  document.getElementById("Next").disabled = currentPage === totalPages;
}



document.addEventListener("DOMContentLoaded", () => {
  FetchData(currentPage);
});