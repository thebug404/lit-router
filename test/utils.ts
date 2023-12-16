export const _delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const _stripExpressionComments = (html: string) => {
  return html.replace(/<!--\?lit\$[0-9]+\$-->|<!--\??-->/g, '');
}

export const _removeWhitespace = (html: string) => html.replace(/\s/g, '')

export const _hasFibonacciNumber = (number: number) => {
  if (number < 0) return false

  let a = 0
  let b = 1

  while (b < number) {
    const temp = b

    b = a + b
    a = temp
  }

  return b === number
}
