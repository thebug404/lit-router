import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

import { router } from '../index.js'

declare global {
  interface HTMLElementTagNameMap {
    "home-page": HomePage;
  }
}

@customElement("home-page")
export class HomePage extends LitElement {
  private _navigate (path: string) {
    router?.navigate({ path })
  }

  protected render(): unknown {
    return html`
      <h1>Home Page</h1>
      <button @click=${() => this._navigate('/about')}>About</button>
      <button @click=${() => this._navigate('/terms')}>Terms</button>
    `;
  }
}
