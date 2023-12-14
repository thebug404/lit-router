import { LitElement, html } from 'lit'

export class AboutPage extends LitElement {
  protected render (): unknown {
    return html`<h1>About Page</h1>`
  }
}

window.customElements.define('about-page', AboutPage)
