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
Asynchronous function called main(). This function will execute all the tasks.
Currently this is fetching the books from the API.
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
    THEN sort the books by ID and map the subjects to uppercase.
    */
    if (all_books) {
        sorted_books = sort_by_id(all_books.results);
        mapped_books = subject_to_uppercase(sorted_books);
    }
}


// Run the main function.
main();