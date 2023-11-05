import { Navigation, NavigationOptions } from './declarations';

/**
 * Navigates to a new route based on the provided navigation options.
 *
 * @param {Partial<Navigation>} navigation - The navigation options, which can include 'name' or 'path'.
 * @param {Partial<NavigationOptions>} option - Optional navigation options like 'preventHistory'.
 */
export const navigate = (navigation: Partial<Navigation>, option: Partial<NavigationOptions> = {}) => {
  const router = document.querySelector('lit-router')

  if (!router) {
    throw new Error('No router found')
  }

  router.navigate(navigation, option)
}

/**
 * Moves forward in the browser's history.
 */
export const forward = () => window.history.forward()

/**
 * Moves backward in the browser's history.
 */
export const back = () => window.history.back()
