const ul = document.querySelector("#list")
async function readUsers(){
    const data = await fetch('../../api/read')
    const users = await data.json()
    for(user of users){
        const li = document.createElement('li')
        li.innerHTML = `Name: ${user.name}, id: ${user.id}`
        ul.appendChild(li)
    }
}
readUsers()