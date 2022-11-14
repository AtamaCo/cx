/**
 * A component within a placement. A Component always originates from a
 * Component Type within Composer Studio.
 */
interface CXComponent {
  /**
   * The component type identifier. This `type` must be registered in the
   * components map.
   *
   * Example: "hero-banner"
   */
  type: string;

  /**
   * The name of the Component Type.
   *
   * Example: "Hero Banner"
   */
  componentTypeName: string;

  /**
   * The unique identifier for the component. A UUID generated by Composer
   * Studio.
   */
  correlationId: string;

  /**
   * The unique identifier for the placement. A UUID generated by Composer
   * Studio.
   */
  placementId: string;

  /**
   * Content properties of a component. The result of a Component Types
   * "contentPropertyConfiguration".
   *
   * Example:
   *
   * ```json
   * {
   *   "title": "Hello World",
   *   "subtitle": "Welcome to the world"
   * }
   */
  contentProperties: object;

  /**
   * Visual properties of a component. The result of a Component Types
   * "visualPropertyConfiguration".
   *
   * Example:
   *
   * ```json
   * {
   *   "size": "xl",
   *   "backgroundColor": "#000000",
   * }
   * ```
   */
  visualProperties: object;
}

/**
 * A placement in a template
 */
export interface CXPlacement<T> {
  /**
   * An identifier for the placement. This `code` must appear in the websites
   * code to properly render the placement.
   *
   * Example: `top`
   */
  code: string;

  /**
   * A blueprint and placements from an experience using this type of blueprint.
   * If a placement is configured in such a way that it allows for embedding
   * other blueprints then this property will be populated. This may end up as a
   * recursive object because an `embeddableBlueprint.placements` contains other
   * `CXPlacement` again.
   */
  embeddableBlueprint?: CXEmbeddableExperience<T>;

  /**
   * The components of the placement. If a placement does not have an embeddable
   * blueprint configured then `components` will be populated.
   *
   * Example:
   *
   * ```json
   * [
   *   // see `CXComponent`
   * ]
   * ```
   */
  components?: CXComponent[];
}

/**
 * An experience.
 */
export interface CXExperience<T> {
  /**
   * Metadata of the channel experience. This is the result of blueprints
   * "metadataPropertyConfiguration".
   */
  meta?: T;

  /**
   * The identifier for the `template`. This `template` must be registered in
   * the templates map.
   */
  template: string;

  /**
   * An array of placements within the embeddable blueprint.
   */
  placements: CXPlacement<T>[];
}

/**
 * An embeddable blueprint
 */
interface CXEmbeddableExperience<T> extends CXExperience<T> {}
