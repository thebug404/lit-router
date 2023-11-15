import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

import { navigate } from '../../utilities.js'

declare global {
  interface HTMLElementTagNameMap {
    "dashboard-page": DashboardPage;
  }
}

@customElement("dashboard-page")
export class DashboardPage extends LitElement {
  protected render (): unknown {
    return html`
      <h1>Dashboard Page</h1>
      <button @click=${() => navigate({ path: '/about' })}>About</button>
      <button @click=${() => navigate({ path: '/terms' })}>Terms</button>
      <main>
        <slot></slot>
      </main>
    `;
  }
}
