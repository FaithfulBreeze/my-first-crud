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
    if(index === -1){
        alert('ID not found...')
        return
    }
    for(properties in users[index]){
        const li = document.createElement('li')
        li.innerHTML = `<span class="nowrap">${properties}: ${users[index][properties]}</span>`
        res_ul.appendChild(li)
    }
})
async function readUsers(){
    const data = await fetch('../../api/read')
    users = await data.json()
    for(user of users){
        const li = document.createElement('li')
        li.innerHTML = `<span class="nowrap">Name: ${user.name}</span>, <span class="nowrap">id: ${user.id}</span>`
        list_ul.appendChild(li)
    }
}
readUsers()