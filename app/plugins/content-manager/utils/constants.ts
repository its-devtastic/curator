import React from "react";

import StringField from "~/plugins/content-manager/ui/fields/String";
import TextField from "~/plugins/content-manager/ui/fields/Text";
import EmailField from "~/plugins/content-manager/ui/fields/Email";
import RichTextField from "~/plugins/content-manager/ui/fields/RichText";
import SlugField from "~/plugins/content-manager/ui/fields/Slug";
import Relation from "~/plugins/content-manager/ui/fields/Relation";
import Enumeration from "~/plugins/content-manager/ui/fields/Enumeration";
import BooleanField from "~/plugins/content-manager/ui/fields/Boolean";
import ComponentField from "~/plugins/content-manager/ui/fields/Component";

import DynamicZone from "~/plugins/content-manager/ui/DynamicZone";

import MediaField from "~/plugins/media-library/ui/fields/MediaField";
import CoverImage from "~/plugins/media-library/ui/fields/CoverImage";

export const SORTABLE_FIELD_TYPES = ["datetime", "string", "uid"];

export const FIELD_TYPES: Record<string, React.FC<any>> = {
  string: StringField,
  email: EmailField,
  text: TextField,
  richtext: RichTextField,
  slug: SlugField,
  uid: StringField,
  media: MediaField,
  coverImage: CoverImage,
  dynamiczone: DynamicZone,
  relation: Relation,
  enumeration: Enumeration,
  boolean: BooleanField,
  component: ComponentField,
};
