import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from '../utils/BooksAPI'
import ListBooks from './ListBooks'
import sortBy from 'sort-by'

class SearchBooks extends Component {
	state = {
		queriedBooks: [],
        noResults: null
	}

	updateQuery = (query) => {
        // Reset displayed books from previous search
        this.setState({
            queriedBooks: [],
            noResults: null
        })

        if (query.target.value !== '') { // So search results are not shown when all of the text is deleted out of search input box
            // Reset displayed books from previous search
            this.setState({
                queriedBooks: [],
                noResults: null
            })

            BooksAPI.search(query.target.value).then( (results) => {
                if (results.length) {
                    Promise.all(results.map( (bookId) => {
                        return BooksAPI.get(bookId.id)
                    })).then((queriedBooks) => {
                        this.setState({
                            queriedBooks: queriedBooks
                        })
                    })
                } else {
                    this.setState({
                        noResults: 'No results matched your search'
                    })
                }
            })
        }
    }

	render() {
		const { queriedBooks, noResults } = this.state,
                           { onMoveBook } = this.props

        // Display books in alphabetical order by title
		queriedBooks.sort(sortBy('title'))

		return (
			<div className="search-books">
            	<div className="search-books-bar">
              		<Link to="/"
              			className="close-search">Close
              		</Link>

              		<div className="search-books-input-wrapper">
                		<input type="text"
                			placeholder="Search by title or author"
                			onChange={this.updateQuery}
                		/>
              		</div>
            	</div>

                <p className="error-no-results">{noResults}</p>

	            <div className="search-books-results">
	            	<ListBooks
	            		showingBooks={queriedBooks}
	            		onMoveBook={onMoveBook}
	            	/>
            	</div>
          	</div>
		)
	}
}

export default SearchBooks