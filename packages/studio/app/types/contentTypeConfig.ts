import type React from "react";
import { TFunction } from "i18next";

import { Entity } from "./content";
import { Attribute } from "@/types/contentType";

export interface ContentTypeConfig {
  apiID: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  fields: FieldDefinition[];
  /**
   * The field that names the entity. Usually called something like `title` or `name`.
   */
  titleField?: string;
  getEntityUrl?(entity: Entity): string;
  /**
   * Renders the content entity, for example in relational fields.
   * Although not required it is recommended to implement this field.
   *
   * @example
   * A simple implementation will just return the identifying field:
   * ```
   * render(entity) => entity.title
   * ```
   */
  render?(
    entity: Entity,
    utils: { t: TFunction<"custom">; context: RenderContext },
  ): React.ReactNode;
}

export interface FieldDefinition {
  path: string;
  label?: string;
  description?: string;
  hint?: string;
  input?:
    | InputType
    | React.FC<{
        onChange(value: any): void;
        value: any;
        attribute: Attribute;
        field: { path: string };
        apiID: string;
        disabled: boolean;
      }>;
  inputProps?: Record<string, any>;
}

export type InputType =
  | "string"
  | "text"
  | "boolean"
  | "slug"
  | "richtext"
  | "media"
  | "coverImage"
  | "uid"
  | "date"
  | "email";

export enum RenderContext {
  /*
   * Inside a selector or list view. Use limited height.
   */
  List = "list",
  /*
   * Inside a card. Used to represent the entity in relational fields.
   */
  Card = "card",
}
