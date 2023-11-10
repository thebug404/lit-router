import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

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
      <a href="/about">About</a>
      <a href="/terms">Terms</a>
    `;
  }
}
