import { customElement, state } from 'lit/decorators.js';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { when } from 'lit/directives/when.js';

import styles from './dashboard.page.css?inline';

import { environments } from '../environments.js'

const { BASE_URL_API } = environments

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-page': DashboardPage;
  }
}

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @state() private _products: any[] = [];

  connectedCallback (): void {
    super.connectedCallback();
    
    this._fetchProducts()
  }

  private async _fetchProducts (): Promise<void> {
    const url = `${BASE_URL_API}/products?_expand=categories`

    const res = await fetch(url)

    const products = await res.json()

    this._products = products
  }

  protected render (): unknown {
    return html`
      <main>
        <ul class="products">
          ${this._products.map(product => html`
            <li class="product">
              <header class="product__header">
                <img
                  class="product__picture"
                  src="${product.picture}"
                  alt="${product.name}"
                />
              </header>

              <main class="product__body">
                <div class="product__highlight">
                  <p class="product__price">$${product.price}</p>

                  ${when(product.categories, () => html`
                    <span class="product__chip">
                      ${product.categories.name}
                    </span>
                  `)}
                </div>
                <h1 class="product__title">${product.name}</h1>
                <p class="product__description">${product.description}</p>
              </main>
            </li>
          `)}
        </ul>
      </main>
    `
  }
}
