import { LitElement, html, css, unsafeCSS } from "lit"
import { customElement } from "lit/decorators.js"

import styles from "./home.page.css?inline"

declare global {
  interface HTMLElementTagNameMap {
    "home-page": HomePage;
  }
}

@customElement("home-page")
export class HomePage extends LitElement {
  static styles = css`${unsafeCSS(styles)}`

  protected render (): unknown {
    return html`
      <main>
        <section class="info">
          <h1>The Official Lit Router</h1>
          <p>
            A simple, lightweight router for LitElement. It supports nested
            routes, dynamic segments, and lazy loading.
          </p>

          <div class="actions">
            <a class="btn__primary" href="/dashboard">Dashboard</a>
            <a
              class="btn__secondary"
              href="https://github.com/thebug404/lit-router"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-brand-github"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
              </svg>
              <span style="margin-left: 5px">Repository</span>
            </a>
          </div>
        </section>

        <section class="picture">
          <figure>
            <img
              src="https://lit.dev/images/logo.svg#flame"
              alt="Random image"
              style="width: 350px; height: 300px;"
            />
          </figure>
        </section>
      </main>
    `;
  }
}