import { Component, Guard, HTMLElementConstructor, RouteConfig } from './declarations.js'

export class Route implements RouteConfig {
  readonly path!: string

  readonly component!: Component

  children: (RouteConfig & Route)[] = []

  beforeEnter: Guard[] = []

  private _parent: Route | null = null

  readonly urlPattern!: URLPattern

  constructor (path: string, component: Component) {
    this.path = path
    this.component = component

    this.urlPattern = new URLPattern(this.path, window.location.origin)
  }

  setParent (parent: Route): void {
    this._parent = parent
  }

  match (path: string): boolean {
    return this.urlPattern.test(window.location.origin + path)
  }

  /**
   * Resolves the provided component and returns an HTMLElement instance.
   *
   * This method is used to take a representation of a component 
   * (such as a function that returns a TemplateResult or a promise
   * that resolves to a custom module) and create an HTMLElement 
   * instance that can be used in the DOM.
   * 
   * @param component The component to resolve.
   */
  private async _resolveComponent (component: Component): Promise<unknown> {
    if (typeof component === 'function') {
      if (component.prototype instanceof HTMLElement) {
        return new (component as HTMLElementConstructor)();
      }

      const Module = await (component as () => Promise<HTMLElementConstructor>)();

      return new Module()
    }
  
    return document.createElement(component as string);
  }

  async resolveRecursiveGuard (): Promise<boolean> {
    if (!this.beforeEnter.length) {
      return Promise.resolve(true)
    }

    const guards = this.beforeEnter.map((guard) => guard())
    const results = await Promise.all(guards)

    const parentGuardResult = this._parent
      ? await this._parent.resolveRecursiveGuard()
      : true

    return results.every((result) => result) && parentGuardResult
  }

  /**
   * Resolves a component and, optionally, nests it in a parent 
   * component using the [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility) pattern.
   * 
   * @param component The component to resolve.
   * @returns A promise that resolves to an HTMLElement instance.
   */
  async resolve (component?: () => HTMLElement): Promise<unknown> {
    let _component: HTMLElement | null = component ? component() : null

    if (!_component) {
      _component = await this._resolveComponent(this.component) as unknown as HTMLElement
    }

    if (this._parent) {
      const parent = await this._resolveComponent(this._parent.component) as HTMLElement

      const child = _component

      parent.appendChild(child as HTMLElement)

      return this._parent.resolve(() => parent)
    }

    return _component
  }
}
