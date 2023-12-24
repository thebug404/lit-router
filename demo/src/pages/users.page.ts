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
  id:        number;
  firstName: string;
  lastName:  string;
  phone:     number;
  email:     string;
  NIT:       string;
  avatar:    string;
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
    const res = await fetch(`${BASE_URL_API}/clients`)

    const users = await res.json()

    this._users = users
  }

  private _generateAvatar (name: string): string {
    return `https://ui-avatars.com/api/?rounded=true&name=${name}&background=random&size=30`
  }

  protected render (): unknown {
    return html`
      <main>
        <table>
          <thead>
            <tr>
              <th>Fullname</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            ${this._users.map(user => html`
              <tr>
                <td>
                  <div style="display: flex; align-items: center;">
                    <span>
                      <img src="${this._generateAvatar(`${user.firstName} ${user.lastName}`)}" alt="${user.firstName} ${user.lastName}">
                    </span>
                    <span style="margin-left: 10px;">${user.firstName} ${user.lastName}</span>
                  </div>
                </td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </main>
    `;
  }
}