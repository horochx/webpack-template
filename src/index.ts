import './style.css'
import logo from './logo-on-white-bg.svg'
;(() => {
  const div = document.createElement('div')

  div.innerHTML = 'hello world'

  div.className = 'text'

  const img = new Image()

  img.src = logo

  img.width = 100

  document.body.appendChild(img)

  document.body.appendChild(div)

  const timeOut = async () => {
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Time Out!')
      }, 1000)
    })
    console.log(result)
  }
  timeOut()
})()
