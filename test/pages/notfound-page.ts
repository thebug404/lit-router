import { LitElement, html } from 'lit'

export class NotFoundPage extends LitElement {
  protected render (): unknown {
    return html`<h1>404 | Not Found</h1>`
  }
}

window.customElements.define('notfound-page', NotFoundPage)
