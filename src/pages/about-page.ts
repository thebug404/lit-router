import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

import { router } from '../index.js'

declare global {
  interface HTMLElementTagNameMap {
    "about-page": AboutPage;
  }
}

@customElement("about-page")
export class AboutPage extends LitElement {
  private _navigate (path: string) {
    router?.navigate({ path })
  }

  protected render(): unknown {
    return html`
      <h1>About Page</h1>
      <button @click=${() => this._navigate('/')}>Home</button>
      <button @click=${() => this._navigate('/terms')}>Terms</button>
    `;
  }
}
