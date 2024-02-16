const ul = document.querySelector("#list")
async function readUsers(){
    const data = await fetch('../../api/read')
    const users = await data.json()
    for(user of users){
        ul.innerHTML += `<li>${user.name}</li> <br>`
    }
}
readUsers()