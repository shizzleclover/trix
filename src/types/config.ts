import { PackageManager } from './package-manager.js';

export type ProjectType = 'frontend' | 'backend' | 'mobile' | 'fullstack';

export type FrontendFramework = 'react' | 'vue' | 'svelte' | 'angular' | 'astro' | 'solid';
export type StylingFramework = 'vanilla' | 'tailwind' | 'bootstrap' | 'css-modules' | 'styled-components' | 'emotion';
export type FrontendAuthProvider = 'privy' | 'clerk' | 'auth0' | 'supabase' | 'firebase' | 'none';
export type UIComponentLibrary = 'shadcn' | 'daisyui' | 'material-ui' | 'chakra' | 'ant-design' | 'none';
export type StateManagement = 'zustand' | 'redux' | 'jotai' | 'recoil' | 'mobx' | 'none';
export type APIClient = 'tanstack-query' | 'swr' | 'axios' | 'fetch';

export type BackendRuntime = 'node' | 'bun' | 'deno';
export type BackendFramework = 'express' | 'fastify' | 'nestjs' | 'hono' | 'koa' | 'elysia' | 'oak';
export type Database = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'redis' | 'none';
export type ORM = 'prisma' | 'drizzle' | 'typeorm' | 'sequelize' | 'mongoose' | 'none';
export type BackendAuthStrategy = 'jwt' | 'passport' | 'lucia' | 'clerk' | 'supabase' | 'none';
export type APIType = 'rest' | 'graphql' | 'trpc';
export type ValidationLibrary = 'zod' | 'joi' | 'yup' | 'none';

// Mobile types
export type MobileFramework = 'expo' | 'react-native-cli';
export type MobileNavigation = 'react-navigation' | 'expo-router' | 'none';
export type MobileStyling = 'nativewind' | 'styled-components' | 'tamagui' | 'vanilla';
export type MobileStateManagement = 'zustand' | 'redux' | 'jotai' | 'mobx' | 'recoil' | 'legend-state' | 'none';
export type MobileAPIClient = 'tanstack-query' | 'axios' | 'ky' | 'fetch';
export type MobileAuthProvider = 'clerk' | 'supabase' | 'firebase' | 'none';

export interface BaseConfig {
  projectName: string;
  projectType: ProjectType;
  packageManager: PackageManager;
  typescript: boolean;
  git: boolean;
  targetDirectory: string;
}

export interface FrontendConfig extends BaseConfig {
  projectType: 'frontend';
  framework: FrontendFramework;
  styling: StylingFramework;
  auth: FrontendAuthProvider;
  uiComponents: UIComponentLibrary[];
  stateManagement: StateManagement;
  apiClient: APIClient;
  routing: boolean;
  pwa: boolean;
  testing: boolean;
}

export interface BackendConfig extends BaseConfig {
  projectType: 'backend';
  runtime: BackendRuntime;
  framework: BackendFramework;
  database: Database;
  orm: ORM;
  auth: BackendAuthStrategy;
  apiType: APIType;
  validation: ValidationLibrary;
  fileUpload: boolean;
  email: boolean;
  queue: boolean;
  cache: boolean;
  testing: boolean;
  logging: boolean;
  docker: boolean;
}

export interface MobileConfig extends BaseConfig {
  projectType: 'mobile';
  framework: MobileFramework;
  navigation: MobileNavigation;
  styling: MobileStyling;
  stateManagement: MobileStateManagement;
  apiClient: MobileAPIClient;
  auth: MobileAuthProvider;
  testing: boolean;
}

export type ProjectConfig = FrontendConfig | BackendConfig | MobileConfig;