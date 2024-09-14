async function fetchBook(url) {

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
    }
    /*
    This is catch block. It will catch any types of errors and log it to the conosle for debugging.
    Then return a null value.
    */
    catch (error) {
    console.error('Error fetching data:', error);
    return null;
    }
}

function get_if_from_url(){
    // Get the query parameters from the current URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the value of 'id'
    const bookId = urlParams.get('id');

    return bookId;
}

function output_information(book){
    console.log(book);
    const book_detail = document.getElementById('book-details');
    book_detail.innerHTML = '';
    
    const information = document.createElement('div');
    
    const bookTitle = document.createElement('h1');
    bookTitle.textContent = `Title: ${book.title}`;

    const bookAuthor = document.createElement('h2');
    const all_authors = book.authors.map(author => author.name).join(', ');
    bookAuthor.textContent = `Author: ${all_authors}`;

    const bookSubjects = document.createElement('p');
    const all_subjects = book.subjects.join(',');
    bookSubjects.textContent = `Subjects: ${all_subjects}`;

    const bookTransaltors = document.createElement('p');
    const all_transaltors = book.translators.join(',');
    bookTransaltors.textContent = `Translators: ${all_transaltors}`;

    const bookLanguages = document.createElement('p');
    const all_languages = book.languages.join(',');
    bookLanguages.textContent = `Languages: ${all_languages}`;

    const bookBookshelves = document.createElement('p');
    const all_shelves = book.bookshelves.join(',');
    bookBookshelves.textContent = `Bookshelves: ${all_shelves}`;

    const bookCopyright = document.createElement('p');
    if (book.copyright){
        bookCopyright.textContent = `Copyright: Yes`;
    }else{
        bookCopyright.textContent = `Copyright: No`;
    }

    const bookMediaType = document.createElement('p');
    bookMediaType.textContent = `Media Type: ${book.media_type}`;

    const bookFormats = document.createElement('div');
    const formatsArray = Object.entries(book.formats).map(([key, value]) => `${key}: ${value}`);
    bookFormats.textContent = `Formats: `;
    for (let format of formatsArray){
        currFormat = document.createElement('p');
        currFormat.textContent = format;
        bookFormats.appendChild(currFormat);
    }

    const bookDownload = document.createElement('p');
    bookDownload.textContent = `Download Couunt: ${book.download_count}`;

    information.appendChild(bookTitle);
    information.appendChild(bookAuthor);
    information.appendChild(bookSubjects);
    information.appendChild(bookTransaltors);
    information.appendChild(bookLanguages);
    information.appendChild(bookBookshelves);
    information.appendChild(bookCopyright);
    information.appendChild(bookMediaType);
    information.appendChild(bookFormats);
    information.appendChild(bookDownload);


    book_detail.appendChild(information);

}

async function main(){
    const bookId = get_if_from_url();
    const url = 'https://gutendex.com/books/';
    const book = await fetchBook(`${url}${bookId}`);
    output_information(book);
}

main();