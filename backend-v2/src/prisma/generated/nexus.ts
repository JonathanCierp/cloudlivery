/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import * as Context from "../context"
import { core } from "@nexus/schema"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    datetime<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    datetime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  AuthPayload: { // root type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Default: { // root type
    message: string; // String!
  }
  DefaultBool: { // root type
    valid: boolean; // Boolean!
  }
  DefaultProduit: { // root type
    count: number; // Int!
    data: NexusGenRootTypes['Produit'][]; // [Produit!]!
  }
  LabelsQualite: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    label: string; // String!
    updatedAt: any; // DateTime!
  }
  Marque: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    label: string; // String!
    updatedAt: any; // DateTime!
  }
  Mutation: {};
  Produit: { // root type
    brand: string; // String!
    createdAt: any; // DateTime!
    ean: string; // String!
    format: string; // String!
    id: number; // Int!
    label: string; // String!
    marque: NexusGenRootTypes['Marque']; // Marque!
    origin: string; // String!
    packaging?: string | null; // String
    per_unit: string; // String!
    per_unit_label: string; // String!
    price: string; // String!
    produit_images: NexusGenRootTypes['ProduitImage'][]; // [ProduitImage!]!
    produit_labels_qualites: NexusGenRootTypes['ProduitLabelsQualite'][]; // [ProduitLabelsQualite!]!
    produit_rayons: NexusGenRootTypes['ProduitRayon'][]; // [ProduitRayon!]!
    provider: NexusGenRootTypes['Provider']; // Provider!
    slug: string; // String!
    tax_message: string; // String!
    unit_of_measure: string; // String!
    updatedAt: any; // DateTime!
    uri: string; // String!
  }
  ProduitImage: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    largest: string; // String!
    size_1500x1500: string; // String!
    size_150x150: string; // String!
    size_195x195: string; // String!
    size_280x280: string; // String!
    size_340x240: string; // String!
    size_340x340: string; // String!
    size_380x380: string; // String!
    size_43x43: string; // String!
    size_540x540: string; // String!
    updatedAt: any; // DateTime!
  }
  ProduitLabelsQualite: { // root type
    labels_qualite: NexusGenRootTypes['LabelsQualite']; // LabelsQualite!
  }
  ProduitRayon: { // root type
    rayon: NexusGenRootTypes['Rayon']; // Rayon!
  }
  Provider: { // root type
    createdAt: any; // DateTime!
    id: number; // Int!
    label: string; // String!
    prefix_url: string; // String!
    updatedAt: any; // DateTime!
  }
  Query: {};
  Rayon: { // root type
    code: string; // String!
    createdAt: any; // DateTime!
    id: number; // Int!
    label: string; // String!
    level: number; // Int!
    resultats: number; // Int!
    scraping: boolean; // Boolean!
    slug: string; // String!
    updatedAt: any; // DateTime!
    uri: string; // String!
  }
  User: { // root type
    civilite: string; // String!
    createdAt: any; // DateTime!
    email: string; // String!
    firstname: string; // String!
    google_id?: string | null; // String
    id: number; // Int!
    lastname: string; // String!
    updatedAt: any; // DateTime!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
}

export interface NexusGenFieldTypes {
  AuthPayload: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Default: { // field return type
    message: string; // String!
  }
  DefaultBool: { // field return type
    valid: boolean; // Boolean!
  }
  DefaultProduit: { // field return type
    count: number; // Int!
    data: NexusGenRootTypes['Produit'][]; // [Produit!]!
  }
  LabelsQualite: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    label: string; // String!
    updatedAt: any; // DateTime!
  }
  Marque: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    label: string; // String!
    updatedAt: any; // DateTime!
  }
  Mutation: { // field return type
    algoliaIndexing: NexusGenRootTypes['Default']; // Default!
    googleSignin: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    resetData: NexusGenRootTypes['Default']; // Default!
    resetPassword: NexusGenRootTypes['Default']; // Default!
    resetPasswordSave: NexusGenRootTypes['Default']; // Default!
    scrapingPuppeteer: NexusGenRootTypes['Default']; // Default!
    setupDatas: NexusGenRootTypes['Default']; // Default!
    signin: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    signout: NexusGenRootTypes['Default']; // Default!
    signup: NexusGenRootTypes['Default']; // Default!
  }
  Produit: { // field return type
    brand: string; // String!
    createdAt: any; // DateTime!
    ean: string; // String!
    format: string; // String!
    id: number; // Int!
    label: string; // String!
    marque: NexusGenRootTypes['Marque']; // Marque!
    origin: string; // String!
    packaging: string | null; // String
    per_unit: string; // String!
    per_unit_label: string; // String!
    price: string; // String!
    produit_images: NexusGenRootTypes['ProduitImage'][]; // [ProduitImage!]!
    produit_labels_qualites: NexusGenRootTypes['ProduitLabelsQualite'][]; // [ProduitLabelsQualite!]!
    produit_rayons: NexusGenRootTypes['ProduitRayon'][]; // [ProduitRayon!]!
    provider: NexusGenRootTypes['Provider']; // Provider!
    slug: string; // String!
    tax_message: string; // String!
    unit_of_measure: string; // String!
    updatedAt: any; // DateTime!
    uri: string; // String!
  }
  ProduitImage: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    largest: string; // String!
    size_1500x1500: string; // String!
    size_150x150: string; // String!
    size_195x195: string; // String!
    size_280x280: string; // String!
    size_340x240: string; // String!
    size_340x340: string; // String!
    size_380x380: string; // String!
    size_43x43: string; // String!
    size_540x540: string; // String!
    updatedAt: any; // DateTime!
  }
  ProduitLabelsQualite: { // field return type
    labels_qualite: NexusGenRootTypes['LabelsQualite']; // LabelsQualite!
  }
  ProduitRayon: { // field return type
    rayon: NexusGenRootTypes['Rayon']; // Rayon!
  }
  Provider: { // field return type
    createdAt: any; // DateTime!
    id: number; // Int!
    label: string; // String!
    prefix_url: string; // String!
    updatedAt: any; // DateTime!
  }
  Query: { // field return type
    me: NexusGenRootTypes['User']; // User!
    produits: NexusGenRootTypes['DefaultProduit'] | null; // DefaultProduit
    tokenIsOk: NexusGenRootTypes['DefaultBool'] | null; // DefaultBool
  }
  Rayon: { // field return type
    code: string; // String!
    createdAt: any; // DateTime!
    id: number; // Int!
    label: string; // String!
    level: number; // Int!
    resultats: number; // Int!
    scraping: boolean; // Boolean!
    slug: string; // String!
    updatedAt: any; // DateTime!
    uri: string; // String!
  }
  User: { // field return type
    civilite: string; // String!
    createdAt: any; // DateTime!
    email: string; // String!
    firstname: string; // String!
    google_id: string | null; // String
    id: number; // Int!
    lastname: string; // String!
    updatedAt: any; // DateTime!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    googleSignin: { // args
      email: string; // String!
      firstname?: string | null; // String
      google_id?: string | null; // String
      lastname?: string | null; // String
      rememberMe: boolean; // Boolean!
    }
    resetPassword: { // args
      email: string; // String!
    }
    resetPasswordSave: { // args
      password: string; // String!
      token: string; // String!
    }
    scrapingPuppeteer: { // args
      provider: string; // String!
    }
    signin: { // args
      email: string; // String!
      password: string; // String!
      rememberMe: boolean; // Boolean!
    }
    signup: { // args
      civilite: string; // String!
      email: string; // String!
      firstname: string; // String!
      lastname: string; // String!
      password: string; // String!
    }
  }
  Query: {
    tokenIsOk: { // args
      token: string; // String!
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AuthPayload" | "Default" | "DefaultBool" | "DefaultProduit" | "LabelsQualite" | "Marque" | "Mutation" | "Produit" | "ProduitImage" | "ProduitLabelsQualite" | "ProduitRayon" | "Provider" | "Query" | "Rayon" | "User";

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: Context.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}