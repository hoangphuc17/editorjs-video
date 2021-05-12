import buttonIcon from "./svg/button-icon.svg";
import SERVICES from "./services";

/**
 * Class for working with UI:
 *  - rendering base structure
 *  - show/hide preview
 *  - apply tune view
 */
export default class Ui {
  /**
   * @param {object} ui - video tool Ui module
   * @param {object} ui.api - Editor.js API
   * @param {VideoConfig} ui.config - user config
   * @param {Function} ui.onSelectFile - callback for clicks on Select file button
   * @param {boolean} ui.readOnly - read-only mode flag
   */
  constructor({ api, config, onSelectFile, readOnly }) {
    this.api = api;
    this.config = config;
    this.onSelectFile = onSelectFile;
    this.readOnly = readOnly;
    this.nodes = {
      wrapper: make("div", [this.CSS.baseClass, this.CSS.wrapper]),
      videoContainer: make("div", [this.CSS.videoContainer]),
      fileButton: this.createFileButton(),
      videoEl: undefined,
      videoPreloader: make("div", this.CSS.videoPreloader),
      caption: make("div", [this.CSS.input, this.CSS.caption], {
        contentEditable: !this.readOnly,
      }),
    };

    /**
     * Create base structure
     *  <wrapper>
     *    <video-container>
     *      <video-preloader />
     *    </video-container>
     *    <caption />
     *    <select-file-button />
     *  </wrapper>
     */
    this.nodes.caption.dataset.placeholder = this.config.captionPlaceholder;
    this.nodes.videoContainer.appendChild(this.nodes.videoPreloader);
    this.nodes.wrapper.appendChild(this.nodes.videoContainer);
    this.nodes.wrapper.appendChild(this.nodes.caption);
    this.nodes.wrapper.appendChild(this.nodes.fileButton);
  }

  /**
   * CSS classes
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      button: this.api.styles.button,

      /**
       * Tool's classes
       */
      wrapper: "video-tool",
      videoContainer: "video-tool__video",
      videoPreloader: "video-tool__video-preloader",
      videoEl: "video-tool__video-picture",
      caption: "video-tool__caption",
      iframeWrapper: "video-tool__video-ratio-16-9",
      iframeVideoEl: "video-tool__video-ratio-16-9-picture",
    };
  }

  /**
   * Ui statuses:
   * - empty
   * - uploading
   * - filled
   *
   * @returns {{EMPTY: string, UPLOADING: string, FILLED: string}}
   */
  static get status() {
    return {
      EMPTY: "empty",
      UPLOADING: "loading",
      FILLED: "filled",
    };
  }

  /**
   * Renders tool UI
   *
   * @param {VideoToolData} toolData - saved tool data
   * @returns {Element}
   */
  render(toolData) {
    if (!toolData.file || Object.keys(toolData.file).length === 0) {
      this.toggleStatus(Ui.status.EMPTY);
    } else {
      this.toggleStatus(Ui.status.UPLOADING);
    }

    return this.nodes.wrapper;
  }

  /**
   * Creates upload-file button
   *
   * @returns {Element}
   */
  createFileButton() {
    const button = make("div", [this.CSS.button]);

    button.innerHTML =
      this.config.buttonContent ||
      `${buttonIcon} ${this.api.i18n.t("Select an Video")}`;

    button.addEventListener("click", () => {
      this.onSelectFile();
    });

    return button;
  }

  /**
   * Shows uploading preloader
   *
   * @param {string} src - preview source
   * @returns {void}
   */
  showPreloader(src) {
    this.nodes.videoPreloader.style.backgroundVideo = `url(${src})`;

    this.toggleStatus(Ui.status.UPLOADING);
  }

  /**
   * Hide uploading preloader
   *
   * @returns {void}
   */
  hidePreloader() {
    this.nodes.videoPreloader.style.backgroundVideo = "";
    this.toggleStatus(Ui.status.EMPTY);
  }

  /**
   * Shows an video
   *
   * @param {string} url - video source
   * @returns {void}
   */
  fillVideo({ url, service }) {
    let eventName = "load";
    console.log(service);

    if (service) {
      const {
        regex,
        embedUrl,
        width,
        height,
        id = (ids) => ids.shift(),
      } = SERVICES[service];
      const result = regex.exec(url).slice(1);
      const embed = embedUrl.replace(/<%= remote_id %>/g, id(result));
      const tag = "iframe";
      const attributes = {
        src: embed,
        width,
        height,
      };

      this.nodes.videoEl = make(tag, this.CSS.iframeVideoEl, attributes);
    } else {
      /**
       * Check for a source extension to compose element correctly: video tag for mp4, img — for others
       */
      const tag = /\.mp4$/.test(url.toLowerCase()) ? "VIDEO" : "IMG";

      const attributes = {
        src: url,
      };

      /**
       * We use eventName variable because IMG and VIDEO tags have different event to be called on source load
       * - IMG: load
       * - VIDEO: loadeddata
       *
       * @type {string}
       */

      /**
       * Update attributes and eventName if source is a mp4 video
       */
      if (tag === "VIDEO") {
        /**
         * Add attributes for playing muted mp4 as a gif
         *
         * @type {boolean}
         */
        attributes.autoplay = false;
        attributes.loop = false;
        attributes.muted = true;
        attributes.playsinline = true;
        attributes.controls = true;

        /**
         * Change event to be listened
         *
         * @type {string}
         */
        eventName = "loadeddata";
      }

      /**
       * Compose tag with defined attributes
       *
       * @type {Element}
       */
      this.nodes.videoEl = make(tag, this.CSS.videoEl, attributes);
    }

    /**
     * Add load event listener
     */
    this.nodes.videoEl.addEventListener(eventName, () => {
      this.toggleStatus(Ui.status.FILLED);

      /**
       * Preloader does not exists on first rendering with presaved data
       */
      if (this.nodes.videoPreloader) {
        this.nodes.videoPreloader.style.backgroundVideo = "";
      }
    });

    let videoNode = this.nodes.videoEl;

    if (service) {
      const iframeWrapper = make("div", this.CSS.iframeWrapper, {});

      iframeWrapper.appendChild(videoNode);
      videoNode = iframeWrapper;
    }

    this.nodes.videoContainer.appendChild(videoNode);
  }

  /**
   * Shows caption input
   *
   * @param {string} text - caption text
   * @returns {void}
   */
  fillCaption(text) {
    if (this.nodes.caption) {
      this.nodes.caption.innerHTML = text;
    }
  }

  /**
   * Shows caption input
   *
   * @param {string} url - url poster image
   * @returns {void}
   */
  fillPoster(url) {
    if (this.nodes.videoEl) {
      if (url) {
        this.nodes.videoEl.setAttribute("poster", url);
      } else {
        this.nodes.videoEl.removeAttribute("poster");
      }
    }
  }

  /**
   * Changes UI status
   *
   * @param {string} status - see {@link Ui.status} constants
   * @returns {void}
   */
  toggleStatus(status) {
    for (const statusType in Ui.status) {
      if (Object.prototype.hasOwnProperty.call(Ui.status, statusType)) {
        this.nodes.wrapper.classList.toggle(
          `${this.CSS.wrapper}--${Ui.status[statusType]}`,
          status === Ui.status[statusType]
        );
      }
    }
  }

  /**
   * Apply visual representation of activated tune
   *
   * @param {string} tuneName - one of available tunes {@link Tunes.tunes}
   * @param {boolean} status - true for enable, false for disable
   * @returns {void}
   */
  applyTune(tuneName, status) {
    this.nodes.wrapper.classList.toggle(
      `${this.CSS.wrapper}--${tuneName}`,
      status
    );

    if (tuneName === "withPoster") {
      this.fillPoster(status);
    }
  }
}

/**
 * Helper for making Elements with attributes
 *
 * @param  {string} tagName           - new Element tag name
 * @param  {Array|string} classNames  - list or name of CSS class
 * @param  {object} attributes        - any attributes
 * @returns {Element}
 */
export const make = function make(tagName, classNames = null, attributes = {}) {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    el[attrName] = attributes[attrName];
  }

  return el;
};
