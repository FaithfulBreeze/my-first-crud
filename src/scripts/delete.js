const input = document.querySelector('input')
const button = document.querySelector('button')
button.addEventListener('click', (event)=>{
    event.preventDefault()
    if(input.value === ''){ //Checking if the field is empty
        alert('Please fill all the fields')
        return
    }
    fetch('../../api/delete', {method: 'DELETE', body:JSON.stringify({ID:input.value})})
    window.location.reload()
})
