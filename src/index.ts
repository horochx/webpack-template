import './style.css'
;(() => {
  const div = document.createElement('div')

  div.innerHTML = 'hello world'

  div.className = 'text'

  document.body.appendChild(div)
})()
