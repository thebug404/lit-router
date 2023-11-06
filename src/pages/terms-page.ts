import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

import { navigate } from '../utilities.js'

declare global {
  interface HTMLElementTagNameMap {
    "terms-page": TermsPage;
  }
}

@customElement("terms-page")
export class TermsPage extends LitElement {
  protected render (): unknown {
    return html`
      <h1>Terms Page</h1>
      <button @click=${() => navigate({ path: '/' })}>Home</button>
      <button @click=${() => navigate({ path: '/about' })}>About</button>
    `;
  }
}
