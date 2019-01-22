;(() => {
  const div = document.createElement('div')

  div.innerHTML = 'hello other page.'

  document.body.appendChild(div)
})()
