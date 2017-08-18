/**
 * Main mi18n class.
 */
export default class I18N {
  static current: any;
  static langs: any;
  static config: any;
  static locale: string | any;
  private defaultConfig: any;
  init: (options?) => Promise<any>;
   /**
   * Process options and start the module
   * @param {Object} options
   */
  constructor(options?: any) {
    this.defaultConfig = {
      extension: '.lang',
      // local or remote directory containing language files
      location: 'assets/lang/',
      // list of available locales, handy for populating selector.
      langs: [
        'en-US'
      ],
      locale: 'en-US', // init with user's preferred language
      preloaded: {}
    };

    /**
     * Load language and set default
     * @param  {Object} options
     * @return {Promise}        resolves language
     */
    this.init = (options)=> {
      I18N.config = Object.assign({}, this.defaultConfig, options);

      I18N.langs = Object.assign({}, I18N.config.preloaded);
      I18N.locale = I18N.config.locale || I18N.config.langs[0];

      return I18N.setCurrent(I18N.locale);
    };

  }


  /**
   * get a string from a loaded language file
   * @param  {String} key  - the key for the string we are trying to retrieve
   * @return {String}      - correct language string
   */
  static getValue(key) {
    return (I18N.current && I18N.current[key]) || key;
  }

  /**
   * Escape variable syntax
   * @param  {String} str
   * @return {String}     escaped str
   */
  static makeSafe(str) {
    const mapObj = {
      '{': '\\{',
      '}': '\\}',
      '|': '\\|'
    };

    str = str.replace(/\{|\}|\|/g, matched => mapObj[matched]);

    return new RegExp(str, 'g');
  }

  /**
   * Temporarily put a string into the currently loaded language
   * @param  {String} key
   * @param  {String} string
   * @return {String} string in current language
   */
  static put(key, string) {
    return I18N.current[key] = string;
  }

  /**
   * Parse arguments for the requested string
   * @param  {String} key  the key we use to lookup our translation
   * @param  {multi}  args  string, number or object containing our arguments
   * @return {String}      updated string translation
   */
  static get(key: any, args: any = null) : any {
    let value = I18N.getValue(key);
    let tokens = value.match(/\{[^\}]+?\}/g);
    let token;

    if (args && tokens) {
      if ('object' === typeof args) {
        for (let i = 0; i < tokens.length; i++) {
          token = tokens[i].substring(1, tokens[i].length - 1);
          value = value.replace(I18N.makeSafe(tokens[i]), args[token] || '');
        }
      } else {
        value = value.replace(/\{[^\}]+?\}/g, args);
      }
    }

    return value;
  }

  /**
   * Turn raw text from the language files into fancy JSON
   * @param  {String} rawText
   * @return {Object} converted language file
   */
  static fromFile(rawText) {
    const lines = rawText.split('\n');
    let lang = {};

    for (let matches, i = 0; i < lines.length; i++) {
      matches = lines[i].match(/^(.+?) *?= *?([^\n]+)/);
      if (matches) {
        let value = matches[2].replace(/^\s+|\s+$/, '');
        lang[matches[1]] = value;
      }
    }

    return lang;
  }

  /**
   * Remove double carriage returns
   * @param  {Object} response
   * @return {Object}          processed language
   */
  static processFile(response) {
    let rawText = response.replace(/\n\n/g, '\n');
    return this.fromFile(rawText);
  }

  /**
   * Load a remotely stored language file
   * @param  {String} locale
   * @return {Promise}       resolves response
   */
  static loadLang(locale) {
    let self = this;

    return new Promise(function(resolve, reject) {
      if (I18N.langs[locale]) {
        resolve(I18N.langs[locale]);
      } else {
        let xhr = new XMLHttpRequest();
        let langFile = this.config.location + locale + I18N.config.extension;
        xhr.open('GET', langFile, true);
        xhr.onload = function() {
          if ((<any>this).status <= 304) {
            let processedFile = self.processFile(xhr.responseText);
            I18N.langs[locale] = processedFile;
            resolve(processedFile);
          } else {
            reject({
              status: (<any>this).status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = function() {
          reject({
            status: (<any>this).status,
            statusText: xhr.statusText
          });
        };
        xhr.send();
      }
    });
  }

  /**
   * return currently available languages
   * @return {Object} all configured languages
   */
  get getLangs() {
    return I18N.config.langs;
  }

  /**
   * Attempt to set the current language to the local provided
   * @param {String}   locale
   * @return {Promise} language
   */
  static async setCurrent(locale = 'en-US') {
    await I18N.loadLang(locale);

    I18N.locale = locale;
    I18N.current = I18N.langs[locale];

    return I18N.current;
  }

}

