const list = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')
const url = `http://localhost:3000/books`

const fetchBooksMenu = () => {
  fetch(url)
  .then(response => response.json())
  .then(booksArray => {
    booksArray.forEach(renderMenuBook)
  })
}

const renderMenuBook = book => {
  const newLi = document.createElement('li')
    newLi.dataset.action = 'show'
    newLi.dataset.id = book.id
    newLi.innerText = book.title 
  list.append(newLi)
}

const fetchBookDetails = e => {
  const id = e.target.dataset.id

  fetch(`${url}/${id}`)
  .then(response => response.json())
  .then(bookObj => {
    renderBook(bookObj)
  })
}

const renderBook = bookObj => {
  const newDiv = document.createElement('div')
  const newH1 = document.createElement('h1')
    newH1.innerText = bookObj.title
  const newImg = document.createElement('img')
    newImg.src = bookObj.img_url
  const newP = document.createElement('p')
    newP.innerText = bookObj.description
  const secondP = document.createElement('p')
    const newEm = document.createElement('em')
    newEm.innerText = `Read by: ${bookObj.users.map(user => user.username)}`
    secondP.append(newEm)
  const newButton = document.createElement('button')
    newButton.dataset.id = bookObj.id
    newButton.dataset.action = 'like'
      if (bookObj.users.map(user => user.username).includes("pouros")) {
        newButton.innerText = "Mark As Not Read"
      } else {
        newButton.innerText = "Mark As Read"
      }
  newDiv.append(newH1, newImg, newP, secondP, newButton)

  showPanel.innerHTML = ""
  showPanel.append(newDiv)
  
  newButton.addEventListener('click', e => {
    const id = e.target.dataset.id
    const userInfo = {id: 1, username: "pouros"}

    if (e.target.innerText === "Mark As Not Read") {
      e.target.innerText = "Mark As Read"
      bookObj.users = bookObj.users.filter(item => {
        if (item.id !== 1) {
        return item
        }
      })

      fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({users: bookObj.users})
      })
      .then(response => response.json())
      .then(updatedBookObj => {
        renderBook(updatedBookObj)
      })
    } else {
    e.target.innerText = "Mark As Not Read"
    bookObj.users.unshift(userInfo)
    fetch(`${url}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({users: bookObj.users})
    })
    .then(response => response.json())
    .then(updatedBookObj => {
      renderBook(updatedBookObj)
    })
    }
  })
}



list.addEventListener('click', e => {
  if (e.target.matches('li')) {
    fetchBookDetails(e)
  }
})

document.addEventListener("DOMContentLoaded", function() {
  fetchBooksMenu()
});
