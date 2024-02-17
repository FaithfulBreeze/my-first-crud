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
    fetch('../../api/create', {method: 'POST', body:JSON.stringify(user)})
    alert('User created!')
    window.location.reload()
})


