let users
const list_ul = document.querySelector("#list")
const res_ul = document.querySelector("#res")
const buttonReadUser = document.querySelector('#button-read-user')
buttonReadUser.addEventListener('click', (event)=>{
    event.preventDefault()
    const idInput = document.querySelector('#id-input')
    const index = users.findIndex((usr)=>{
        return usr.id === idInput.value
    })
    for(properties in users[index]){
        const li = document.createElement('li')
        li.innerHTML = `${properties}: ${users[index][properties]}`
        res_ul.appendChild(li)
    }
})
async function readUsers(){
    const data = await fetch('../../api/read')
    users = await data.json()
    for(user of users){
        const li = document.createElement('li')
        li.innerHTML = `Name: ${user.name}, id: ${user.id}`
        list_ul.appendChild(li)
    }
}
readUsers()