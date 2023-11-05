import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

import { navigate } from '../utilities.js'

declare global {
  interface HTMLElementTagNameMap {
    "about-page": AboutPage;
  }
}

@customElement("about-page")
export class AboutPage extends LitElement {
  protected render (): unknown {
    return html`
      <h1>About Page</h1>
      <button @click=${() => navigate({ path: '/' })}>Home</button>
      <button @click=${() => navigate({ path: '/terms' })}>Terms</button>
    `;
  }
}
