import { LitElement, PropertyValueMap, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

declare global {
  interface HTMLElementTagNameMap {
    'lit-router-link': LitRouterLink
  }
}

@customElement('lit-router-link')
export class LitRouterLink extends LitElement {
  static styles = css`
    :host {
      display: var(--lit-router-link-display, inline-block);
    }

    :host([active]) a {
      color: var(--lit-router-link-active-color, #324fff);
      text-decoration: var(--lit-router-link-active-text-decoration, underline);
    }
  `

  @property({ type: String }) to!: string

  @property({ type: Boolean, reflect: true }) active = false

  @property({ type: String, reflect: true }) role = 'link'

  @property({ type: Boolean }) disabled = false

  connectedCallback(): void {
    super.connectedCallback()

    this.active = window.location.pathname === this.to
  }

  protected updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('disabled')) {
      this.ariaDisabled = String(this.disabled)
    }

    if (changedProperties.has('active')) {
      if (this.active) {
        this._unCheckAllLinks()
      }
    }
  }

  private _unCheckAllLinks(): void {
    this._getRouterLinks()
      .filter((link) => link !== this)
      .forEach((link) => {
        link.active = false
      })
  }

  private _getRouterLinks(): LitRouterLink[] {
    return [...document.querySelectorAll('lit-router-link')]
  }

  private _onClick(event: Event): void {
    event.preventDefault()

    if (this.disabled) return

    this.active = true

    window.history.pushState({}, '', this.to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  protected render(): unknown {
    return html`
      <a href=${this.to} @click="${this._onClick}">
        <slot></slot>
      </a>
    `;
  }
}
