import '@/style.css'
import logo from '@/logo-on-white-bg.svg'
import { cube } from '@/math'
;(() => {
  const img = new Image()

  img.src = logo

  img.width = 100

  document.body.appendChild(img)

  const helloWorld = document.createElement('div')

  helloWorld.innerHTML = 'hello world'

  helloWorld.className = 'text'

  document.body.appendChild(helloWorld)

  const computed = document.createElement('div')

  computed.innerHTML = `The cube of 3 is ${cube(3)}`

  computed.className = 'text'

  document.body.appendChild(computed)

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
