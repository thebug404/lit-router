import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

declare global {
  interface HTMLElementTagNameMap {
    "not-found-page": NotFoundPage;
  }
}

@customElement("not-found-page")
export class NotFoundPage extends LitElement {
  protected render (): unknown {
    return html`
      <h1>Not Found Page</h1>
    `;
  }
}
