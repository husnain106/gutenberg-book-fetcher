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
    //Log the sorted books in the console and return the result
    console.log("Sorted books: ", sorted_books);
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
    //Log the result on the console and return it
    console.log("Subjects changed to uppercase", books);
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
    //log the filtered_books array on the console
    console.log("Filtered books: ", filtered_books);
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
            //if book title matches then check for author match..
            //used nested if statement so doesn't always have to do the extra step of checking author.
            if (book.title === book_title){
                const hasTargetAuthor = book.authors.some(author => author.name === author_name);
                if (hasTargetAuthor){
                    //if title and author match, then log the result on console and return it.
                    console.log("Found the book:", book);
                    return book;
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


/*
Asynchronous function called main(). This function will execute all the tasks.
Currently this is fetching the books from the API.
***No Parameters
***No outputs
*/
async function main() {

    // Initialise a constant variable which holds the value of the target URL for the GET request.
    const initialUrl = 'https://gutendex.com/books/';

    /*
    Call on function called fetchBooks to handle the procedure of fetching.
    Wait until fetchBooks has finished executing before carrying on.
    Save the fetched data in a variable called books.
    */
    let all_books = await fetchBooks(initialUrl);
    
    /*
    If all_books is not empty i.e. the data has been successfully fetched from the API.
    THEN sort the books by ID, map the subjects to uppercase and filter the books to only show books by authors alive in the last 200 years.
    */
    if (all_books) {
        sorted_books = sort_by_id(all_books.results);
        mapped_books = subject_to_uppercase(sorted_books);
        filtered_books = filter_by_lifespan(mapped_books);

    }
    //wait until the asynchronous function find_book has been executed before executing next line.
    //this function searched for a book by an author which need to be added as parameters.
    await find_book(initialUrl, "Short Stories", "Dostoyevsky, Fyodor");

    //at the end log goodbye on the console to mark the end.
    console.log("Goodbye.");
}


// Run the main function.
main();
