import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from './dashboard.page.css?inline';

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-page': DashboardPage;
  }
}

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  protected render (): unknown {
    return html`
      <h1>Dashboard</h1>
    `
  }
}
