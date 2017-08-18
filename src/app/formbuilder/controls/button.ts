/**
 * Button class
 * Output a <button>Label</button> form element
 */

import {control} from "../control";

export default class controlButton extends control {

  /**
   * build a text DOM element, supporting other jquery text form-control's
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    return {
      field: super.markup('button', this.label, this.config),
      layout: 'noLabel'
    };
  }
}

// register the following controls
control.register('button', controlButton);
control.register(['button', 'submit', 'reset'], controlButton, 'button');
