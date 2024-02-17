const inputs = document.getElementsByTagName('input')
const button = document.querySelector('button')
const user = {}
button.addEventListener('click', (event)=>{
    event.preventDefault()
    for(input of inputs){
        if(input.value === ''){
            alert('Please fill all the fields')
            return
        }
        user[input.id] = input.value
    }
    async function readUsers(){
        const data = await fetch('../../api/read')
        const users = await data.json()
        return users.findIndex((usr)=>{
            return usr.id === user.id
        })
    }
    readUsers().then(index=>{
        if(index === -1){
            alert('ID not found...')
        }
        user.index = index
        fetch('../../api/update', {method: 'PUT', body:JSON.stringify(user)})
    })
    alert('User updated!')
    window.location.reload()
})


