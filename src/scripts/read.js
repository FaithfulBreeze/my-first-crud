const list_ul = document.querySelector("#list")
const user_ul = document.querySelector("#user-info")
const buttonReadUser = document.querySelector('#button-read-user')

buttonReadUser.addEventListener('click', (event)=>{
    event.preventDefault()
    const ID = document.querySelector('#id-input').value
    if(ID === ''){
        alert('Please fill all the fields')
        return
    }
    user_ul.innerHTML = ''
    readUsers(ID) //Executes the readUsers function with an ID param (get a specific user)
})

async function readUsers(userID){
    if(userID){ //Check if a specific user is requested
        const data = await fetch(`../../api/read/id=${userID}`)
        const user = await data.json()
        if(user.exists === false){ //Check if the user was found
            alert('ID not found...')
            return
        }
        for(property in user){ //If found
            const li = document.createElement('li')
            li.innerHTML = `<span class="nowrap">${property}: ${user[property]}</span>`
            user_ul.appendChild(li)
        }
        return
    }
    //If ID is not passed gets all users
    const data = await fetch('../../api/read')
    const users = await data.json()
    if(users.length == 0) return list_ul.innerHTML = "Empty database."
    for(let user of users){
        const li = document.createElement('li')
        li.innerHTML = `<span class="nowrap">Name: ${user.name}</span>, <span class="nowrap">id: ${user.id}</span>`
        list_ul.appendChild(li)
    }
}
readUsers()