import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

declare global {
  interface HTMLElementTagNameMap {
    "about-page": AboutPage;
  }
}

@customElement("about-page")
export class AboutPage extends LitElement {
  protected render(): unknown {
    return html`<h1>About Page</h1>`;
  }
}
