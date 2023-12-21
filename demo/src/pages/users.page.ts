import { customElement, state } from "lit/decorators.js";
import { LitElement, css, html, unsafeCSS } from "lit";

import styles from "./users.page.css?inline";

import { environments } from '../environments.js'

const { BASE_URL_API } = environments

declare global {
  interface HTMLElementTagNameMap {
    "users-page": UsersPage;
  }
}

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: Date;
  updatedAt: Date;
}


@customElement("users-page")
export class UsersPage extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @state() private _users: User[] = []

  connectedCallback(): void {
    super.connectedCallback();
    
    this._fetchUsers()
  }

  private async _fetchUsers (): Promise<void> {
    const res = await fetch(`${BASE_URL_API}/users`)

    const users = await res.json()

    this._users = users
  }

  private _generateAvatar (name: string): string {
    return `https://ui-avatars.com/api/?rounded=true&name=${name}&background=random&size=80`
  }

  protected render (): unknown {
    return html`
      <main>
        <ul class="users">
          ${this._users.map((user) => html`
            <li class="user">
              <hwc-card>
                <div class="user">
                  <img
                    src="${this._generateAvatar(user.name)}"
                    class="user__image"
                    alt="${user.name}"
                  >

                  <div class="user__description">
                    <h2>${user.name}</h2>
                    <p>${user.email}</p>
                  </div>
                </div>
              </hwc-card>
            </li>
          `)}
        </ul>
      </main>
    `;
  }
}