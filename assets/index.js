// decleration of all objects
const mainCard = document.querySelector(`.main-card`);
const searchBar = document.querySelector(`.search-bar`);
const searchInput = document.querySelector(`.form-control`);
const searchBtn = document.querySelector(`.btn`);
const resultsList = document.querySelector(`.results-list`);
const loader = document.createElement(`div`);
loader.classList.add(`loader`);

// handleSearch is for every search button click, async cause includes a fetch function
const handleSearch = async () => {
    resetValues(); //resets values for no mistakes

    const txt = searchInput.value;
    const results = await fetchResults(txt); //waits for fetch
    extendCard(results.length); //main card gets bigger
    const list = document.createElement(`div`);
    for (let i = 0; i < results.length; i++) {
        const row = document.createElement(`a`);
        row.href = `/company.html?symbol=${results[i].symbol}`; //creates href for each line
        row.innerText = `${results[i].name} (${results[i].symbol})`;
        row.classList.add(`result-row`);
        if(i == 0) //first row will have top margin
            row.style.marginTop = `4vh`;
        list.append(row);
    }
    list.classList.add(`results-list`);
    setTimeout(() => { //timeout so that the main card will finish the height animation
        searchBar.removeChild(loader); //removes loader animation
        mainCard.append(list); //manipulates the DOM only once to ease on the browser
    }, 1000)
}

//fetchResults gets the data from the server and return an array to present to the user, async cause includes fetch
const fetchResults = async (txt) => {
    searchBar.append(loader); //adds loader animation
    const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${txt}&amp;limit=10&amp;exchange=NASDAQ`; //sets up the url to fetch
    let list = [];
    await fetch(url) //waits for fetch
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < 10 && data[i] != null; i++)
                list[i] = data[i]; //assigns the values to the returning object
        })
        .catch(err => console.log(err));
    return list;
}

//extendCard will set the height of the main card according to the length of the list to present
const extendCard = (lengthOfList) => {
    if (lengthOfList == 10) //if the list is full, go to full height
        mainCard.classList.add(`activate-height`);
    else //if not, specifies height with length of rows in the list
        mainCard.classList.add(`activate-smaller-height`);
}

//resetValues simply resets all the values of the objects which are changing
const resetValues = () => {
    mainCard.classList.remove(`activate-height`);
    mainCard.classList.remove(`activate-smaller-height`);
    if(mainCard.childElementCount > 2) //removes list if was presented
        mainCard.removeChild(mainCard.lastChild);
}

searchBtn.addEventListener(`click`, handleSearch);