import inquirer from 'inquirer';
import {
  FrontendFramework,
  StylingFramework,
  FrontendAuthProvider,
  UIComponentLibrary,
  StateManagement,
  APIClient
} from '../../types/config';

export class FrontendPrompts {
  async collect() {
    const framework = await this.selectFramework();
    const styling = await this.selectStyling();
    const auth = await this.selectAuth();
    const uiComponents = await this.selectUIComponents();
    const stateManagement = await this.selectStateManagement();
    const apiClient = await this.selectAPIClient();
    const { routing, pwa, testing } = await this.selectAdditionalFeatures();
    
    return {
      projectType: 'frontend' as const,
      framework,
      styling,
      auth,
      uiComponents,
      stateManagement,
      apiClient,
      routing,
      pwa,
      testing
    };
  }
  
  private async selectFramework(): Promise<FrontendFramework> {
    const { framework } = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Choose a frontend framework:',
        choices: [
          { name: 'React', value: 'react' },
          { name: 'Vue', value: 'vue' },
          { name: 'Svelte', value: 'svelte' },
          { name: 'Angular', value: 'angular' },
          { name: 'Astro', value: 'astro' },
          { name: 'Solid', value: 'solid' }
        ]
      }
    ]);
    
    return framework;
  }
  
  private async selectStyling(): Promise<StylingFramework> {
    const { styling } = await inquirer.prompt([
      {
        type: 'list',
        name: 'styling',
        message: 'Choose a styling solution:',
        choices: [
          { name: 'Tailwind CSS', value: 'tailwind' },
          { name: 'Vanilla CSS', value: 'vanilla' },
          { name: 'Bootstrap', value: 'bootstrap' }
        ]
      }
    ]);
    
    return styling;
  }
  
  private async selectAuth(): Promise<FrontendAuthProvider> {
    const { auth } = await inquirer.prompt([
      {
        type: 'list',
        name: 'auth',
        message: 'Choose an authentication provider:',
        choices: [
          { name: 'None', value: 'none' },
          { name: 'Privy', value: 'privy' },
          { name: 'Clerk', value: 'clerk' },
          { name: 'Auth0', value: 'auth0' }
        ]
      }
    ]);
    
    return auth;
  }
  
  private async selectUIComponents(): Promise<UIComponentLibrary[]> {
    const { uiComponents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'uiComponents',
        message: 'Select UI component libraries (optional):',
        choices: [
          { name: 'shadcn/ui', value: 'shadcn' },
          { name: 'daisyUI', value: 'daisyui' }
        ]
      }
    ]);
    
    return uiComponents;
  }
  
  private async selectStateManagement(): Promise<StateManagement> {
    const { stateManagement } = await inquirer.prompt([
      {
        type: 'list',
        name: 'stateManagement',
        message: 'Choose a state management solution:',
        choices: [
          { name: 'None', value: 'none' },
          { name: 'Zustand', value: 'zustand' },
          { name: 'Redux Toolkit', value: 'redux' }
        ]
      }
    ]);
    
    return stateManagement;
  }
  
  private async selectAPIClient(): Promise<APIClient> {
    const { apiClient } = await inquirer.prompt([
      {
        type: 'list',
        name: 'apiClient',
        message: 'Choose an API client:',
        choices: [
          { name: 'TanStack Query', value: 'tanstack-query' },
          { name: 'Axios', value: 'axios' },
          { name: 'Fetch', value: 'fetch' }
        ]
      }
    ]);
    
    return apiClient;
  }
  
  private async selectAdditionalFeatures() {
    const { features } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select additional features:',
        choices: [
          { name: 'Routing', value: 'routing', checked: true },
          { name: 'PWA Support', value: 'pwa' },
          { name: 'Testing Setup', value: 'testing' }
        ]
      }
    ]);
    
    return {
      routing: features.includes('routing'),
      pwa: features.includes('pwa'),
      testing: features.includes('testing')
    };
  }
}