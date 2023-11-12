import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

import { navigate } from '../../utilities.js'

declare global {
  interface HTMLElementTagNameMap {
    "users-page": UsersPage;
  }
}

@customElement("users-page")
export class UsersPage extends LitElement {
  protected render (): unknown {
    return html`
      <h1>Users Page</h1>
      <button @click=${() => navigate({ pathname: '/about' })}>About</button>
      <button @click=${() => navigate({ pathname: '/terms' })}>Terms</button>
      <main>
        <slot></slot>
      </main>
    `;
  }
}
