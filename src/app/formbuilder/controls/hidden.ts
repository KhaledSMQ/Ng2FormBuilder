/**
 * Hidden input class
 * Output a <input type="hidden" ... /> form element
 */

import {control} from "../control";

export default class controlHidden extends control {

  /**
   * build a hidden input dom element
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    return {
      field: this.markup('input', null, this.config),
      layout: 'hidden'
    };
  }
}

// register the following controls
control.register('hidden', controlHidden);
