/*
Asynchronous function to fetch the data from the API.
***Parameters required:
    - url : the target url for the GET request.
***Output:
    - data : array of books fetched from the url.
*/
async function fetchBooks(url) {

    //Use a try catch block to catch any errors.
    try {
        /*
        Initiates a http request to the url and awaits for a response before executing next code.
        Assigns the response from the http request to the variable response.
        */
        let response = await fetch(url);
        
        /*
        response.ok is true if the response status is between 200-299 (successful) and false otherwise.
        If the status is not response.ok then throw an error which will transfer control to the catch block.
        Otherwise carry executing code as normal.
        */
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        /*
        Convert the response body to a JavaScript object or array by parsing JSON.
        Assign this to a variable called data.
        Return the variable data.
        */
        let data = await response.json();
        return data;
    /*
    This is catch block. It will catch any types of errors and log it to the conosle for debugging.
    Then return a null value.
    */
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

/*
This function sorts out the books by their id.
***Parameters required:
    - books : the unsorted array of books.
***Output:
    - sorted_books : the sorted array of books.
*/
function sort_by_id(books){
    //Sorts the books array by the id property of each book in ascending order. Save the results in sorted_books.
    sorted_books = books.sort((a, b) => a.id - b.id);
    //return the result
    return sorted_books;
    
}


/*
This function changes the subjects of the books to uppercase.
***Parameters required:
    - books : the array of books.
***Output:
    - books : the array of books after the subjects of every book have been changed to uppercase
*/
function subject_to_uppercase(books){
    //For each book in books, map each of their subject from subjects to uppercase.
    books = books.map(book => ({
        ...book,
        subjects: book.subjects.map(subject => subject.toUpperCase())
        }));
    //return the results
    return books;
}

/*
This function filters the books by the authour deceased date. This is used to ensure the author was alive in the last 200 years.
***Parameters required:
    - books : the array of books
***Output:
    - filtered_books : the array of books after it has been filtered to only include books by authors that were alive in the last 200 years.
*/
function filter_by_lifespan(books){
    //Calculates the current year and saves it as a constant variable
    const currentYear = new Date().getFullYear();
    //create a new array filtered_books, which contains all the book in books that pass a certain test
    filtered_books = books.filter(book => {
        //the test for filtering the books is if the different between the death year and current is less than 200 ie if the author was alive in the last 200 years
        return book.authors.some(author => currentYear - author.death_year <= 200);
    });
    //return the filtered books.
    return filtered_books;
}

/*
This Asynchronous function iterates through all the pages to find a specific book by a specific author.
***Parameteres required:
    - url : url of the first page of books.
    - book_title : the title of the book that is being searched.
    - author_name : the name of the author of the book being searched.
***Output:
    - book : the data about the book where the title and author name matches to the one being searched.
*/
async function find_book(url, book_title, author_name){
    //set current URL
    let currURL = url;
    console.log("checking");

    //run a while loop until all the pages have been exhausted.
    while (currURL){

        //fetch the books from the current URL.
        let currBooks = await fetchBooks(currURL);
        //ensure the books have been fetched.
        if (!currBooks){
            break;
        }

        //execute a for loop for every book on the current page of books.
        for (let book of currBooks.results) {
            console.log(book.title);
            //if book title matches then check for author match..
            //used nested if statement so doesn't always have to do the extra step of checking author.
            //puts the title and author to lower case before checking for a match
            if (book.title.toLowerCase() === book_title.toLowerCase()){
                const hasTargetAuthor = book.authors.some(author => author.name.toLowerCase() === author_name.toLowerCase());
                if (hasTargetAuthor){
                    //if title and author match, then log the result on console and return it.
                    console.log("Found the book:", book);
                    return [book];
                }
            }
        }
        //if the book not found on current page then move on to the next page.
        currURL = currBooks.next;
    }
    //if book not found on any of the pages then output a suitable message and return null.
    console.log("Book not found");
    return null;
}

// Function to display books in Google-style search result format
/*
This function displays all the books in a div on the html page
***Parameters:
    - books : the array if books needed to be shown on the webpage
*/
function displayBooks(books) {
    //save the div where all the results of the books need to go as resultSection
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = '';  // Clear existing content

    //the number of results
    let book_count = books.length;
    //the div where the results counter needs to be displayed
    const resultCounter = document.getElementById('result-counter');
    //show the result counter on the webpage
    resultCounter.innerHTML = ('Showing '+ book_count.toString() + ' results...');

    //output every book on the books array
    for (let book of books){
        //create the div element with class for styling
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        //add a google like link for the book which opens the book in a new page by calling the function book_detail(${book.id})
        const titleLink = document.createElement('a');
        titleLink.setAttribute('onclick', `book_detail(${book.id})`);
        titleLink.href = `javascript:void(0)`;
        titleLink.classList.add('result-title');
        titleLink.textContent = book.title;

        const authorsText = document.createElement('div');
        authorsText.classList.add('result-author');
        authorsText.textContent = book.authors.map(author => author.name).join(', ');

        const subjectsText = document.createElement('div');
        subjectsText.classList.add('result-subjects');
        subjectsText.textContent = `Subjects: ${book.subjects.join(', ')}`;

        //add the elements to the div created at the start of this iteration
        resultItem.appendChild(titleLink);
        resultItem.appendChild(authorsText);
        resultItem.appendChild(subjectsText);

        //add the div created at the start of this for loop to the resultSection
        resultsSection.appendChild(resultItem);
    };
}

/*
This function generates a url to the page where the details of books are shown with the id as a parameter in the url
***Parameters:
    - id : the id of the book that user wants more details on
*/
function book_detail(id){
    //this is the current url to the root directory
    const currentUrl = 'https://husnain106.github.io/gutenberg-book-fetcher/';
    
    //using the root directory url, generate the url for this specific book id
    const url = `${currentUrl}/book.html?id=${id}`;
    //open the page with the details about the book in a new tab
    window.open(url, '_blank');
}

/*
This asynchronous function is called when the search button is pressed from the index.html page.
This function ensures the correct results are shown depending on the search criteria
*/
async function newsearch() {
    //get values from the html page
    const searchBook = document.getElementById('searchBook').value.trim();
    const searchAuthor = document.getElementById('searchAuthor').value.trim();
    const map = document.getElementById('uppercaseCheckbox').checked;
    const filter = document.getElementById('filterCheckbox').checked;

    //initial url for checking the books
    const initialUrl = 'https://gutendex.com/books/';

    //if the searchBook or searchAuthor is empty then all the books will be fetches
    //else look for the book sepcified by title and author
    if (searchBook === '' || searchAuthor === ''){
        //fetch books and sort by id
        let page = await fetchBooks(initialUrl);
        books = sort_by_id(page.results);
        //if mapping needed then map the subjects to uppercase
        if (map){
            books = subject_to_uppercase(books);
        }
        //if filter needed then filter
        if (filter){
            books = filter_by_lifespan(books);
        }
        //log the output for trouble shooting purposes
        console.log("Output", books);
        //display the fetched books on the webpage
        displayBooks(books);
    }else{
        //search for the book
        book = await find_book(initialUrl, searchBook, searchAuthor);
        if (map){
            book = subject_to_uppercase(book);
        }
        //display the book on the webpage
        displayBooks(book);
    }
    
}