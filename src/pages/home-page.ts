import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

import { navigate } from '../utilities.js'

declare global {
  interface HTMLElementTagNameMap {
    "home-page": HomePage;
  }
}

@customElement("home-page")
export class HomePage extends LitElement {
  protected render (): unknown {
    return html`
      <h1>Home Page</h1>
      <button @click=${() => navigate({ path: '/about' })}>About</button>
      <button @click=${() => navigate({ path: '/terms' })}>Terms</button>
    `;
  }
}
