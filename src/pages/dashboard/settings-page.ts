import { customElement } from "lit/decorators.js";
import { LitElement, html } from "lit";

import { navigate } from '../../utilities.js'

declare global {
  interface HTMLElementTagNameMap {
    "settings-page": SettingsPage;
  }
}

@customElement("settings-page")
export class SettingsPage extends LitElement {
  protected render (): unknown {
    return html`
      <h1>Settings Page</h1>
      <button @click=${() => navigate({ path: '/about' })}>About</button>
      <button @click=${() => navigate({ path: '/terms' })}>Terms</button>
    `;
  }
}
