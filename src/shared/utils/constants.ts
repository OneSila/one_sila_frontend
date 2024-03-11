export const PUBLIC_ROUTES = ['auth.login', 'auth.register', 'auth.register.company', 'auth.recover', 'auth.recover.token', 'auth.accept.invite.token'];
export  const DEFAULT_LANGUAGE = {"code": "en", "name": "English"}

export  interface Url {
  name: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export enum FieldType {
  Boolean = "Boolean",
  Text = "Text",
  Choice = "Choice",
  Query = "Query",
  Date = "Date",
  Slider = "Slider",
  Checkbox = "Checkbox",
  Hidden = "Hidden",
  ProxyChoice = "ProxyChoice",
  Image = "Image",
  NestedText = "NestedText",
  Array = "Array",
}

export const OrderStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  PENDING_INVENTORY: 'PENDING_INVENTORY',
  TO_PICK: 'TOPICK',
  TO_SHIP: 'TOSHIP',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
  HOLD: 'HOLD',
  EXCHANGED: 'EXCHANGED',
  REFUNDED: 'REFUNDED',
  LOST: 'LOST',
  MERGED: 'MERGED',
  DAMAGED: 'DAMAGED',
  VOID: 'VOID',
  ORDERED: 'ORDERED', // from this one to the bottom are purchase order statuses
  CONFIRMED: 'CONFIRMED',
  PENDING_DELIVERY: 'PENDING_DELIVERY',
  DELIVERED: 'DELIVERED',
};

export const ReasonForSale = {
  SALE: 'SALE',
  RETURNGOODS: 'RETURN',
  DOCUMENTS: 'DOCUMENTS',
  SAMPLE: 'SAMPLE',
  GIFT: 'GIFT',
};

export const UNPROCESSED_ORDER = [OrderStatus.PENDING];
export const DONE__ORDER = [
  OrderStatus.DONE, OrderStatus.CANCELLED, OrderStatus.HOLD,
  OrderStatus.EXCHANGED, OrderStatus.REFUNDED, OrderStatus.LOST,
  OrderStatus.MERGED, OrderStatus.DAMAGED
];
export const HELD_ORDER = [OrderStatus.HOLD, OrderStatus.PENDING_INVENTORY];

export const PRODUCT_VARIATION = 'VARIATION'
export const PRODUCT_BUNDLE = 'BUNDLE'
export const PRODUCT_UMBRELLA = 'UMBRELLA'

export const ProductType = {
  Variation: PRODUCT_VARIATION,
  Bundle: PRODUCT_BUNDLE,
  Umbrella: PRODUCT_UMBRELLA,
};