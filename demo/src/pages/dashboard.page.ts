import { customElement } from 'lit/decorators.js';
import { LitElement, html } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-page': DashboardPage;
  }
}

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  protected render (): unknown {
    return html`
      <h1>Dashboard</h1>
    `
  }
}
