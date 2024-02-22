const inputs = document.getElementsByTagName('input')
const button = document.querySelector('button')
const user = {}
button.addEventListener('click', (event)=>{
    event.preventDefault()
    for(input of inputs){ //Checking if there is an empty field
        if(input.value === ''){
            alert('Please fill all the fields')
            return
        }
        user[input.id] = input.value //Populating user properties
    }
    fetch('../../api/update', {method: 'PUT', body:JSON.stringify(user)})
    window.location.reload()
})


