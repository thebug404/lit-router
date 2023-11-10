import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

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
      <a href="/">Home</a>
      <a href="/about">About</a>
    `;
  }
}
