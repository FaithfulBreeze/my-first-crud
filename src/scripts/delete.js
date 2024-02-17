const input = document.getElementsByTagName('input')[0]
const button = document.querySelector('button')
const user = {}
button.addEventListener('click', (event)=>{
    event.preventDefault()
        if(input.value === ''){
            alert('Please fill all the fields')
            return
        }
        async function readUsers(){
            const data = await fetch('../../api/read')
            const users = await data.json()
            return users.findIndex((usr)=>{
                return usr.id === input.value
            })
        }
        readUsers().then(index=>{
            if(index === -1){
                alert('ID not found...')
                return
            }
            user.index = index
            fetch('../../api/delete', {method: 'DELETE', body:JSON.stringify(user)})
            alert('User deleted!')
            window.location.reload()
        })
    }
)

