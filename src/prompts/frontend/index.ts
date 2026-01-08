import inquirer from 'inquirer';
import {
  FrontendFramework,
  StylingFramework,
  FrontendAuthProvider,
  UIComponentLibrary,
  StateManagement,
  APIClient
} from '../../types/index.js';

export class FrontendPrompts {
  async collect() {
    const framework = await this.selectFramework();
    const styling = await this.selectStyling(framework);
    const auth = await this.selectAuth(framework);
    const uiComponents = await this.selectUIComponents(framework, styling);
    const stateManagement = await this.selectStateManagement(framework);
    const apiClient = await this.selectAPIClient();
    const { routing, pwa, testing } = await this.selectAdditionalFeatures(framework);

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

  private async selectStyling(framework: FrontendFramework): Promise<StylingFramework> {
    const choices = this.getStylingChoices(framework);

    const { styling } = await inquirer.prompt([
      {
        type: 'list',
        name: 'styling',
        message: 'Choose a styling solution:',
        choices
      }
    ]);

    return styling;
  }

  private getStylingChoices(framework: FrontendFramework) {
    const common = [
      { name: 'Tailwind CSS', value: 'tailwind' },
      { name: 'Vanilla CSS', value: 'vanilla' },
      { name: 'CSS Modules', value: 'css-modules' },
      { name: 'Bootstrap', value: 'bootstrap' }
    ];

    if (framework === 'react' || framework === 'vue') {
      common.push(
        { name: 'Styled Components', value: 'styled-components' },
        { name: 'Emotion', value: 'emotion' }
      );
    }

    return common;
  }

  private async selectAuth(framework: FrontendFramework): Promise<FrontendAuthProvider> {
    const { auth } = await inquirer.prompt([
      {
        type: 'list',
        name: 'auth',
        message: 'Choose an authentication provider:',
        choices: [
          { name: 'None', value: 'none' },
          { name: 'Privy', value: 'privy' },
          { name: 'Clerk', value: 'clerk' },
          { name: 'Auth0', value: 'auth0' },
          { name: 'Supabase Auth', value: 'supabase' },
          { name: 'Firebase Auth', value: 'firebase' }
        ]
      }
    ]);

    return auth;
  }

  private async selectUIComponents(
    framework: FrontendFramework,
    styling: StylingFramework
  ): Promise<UIComponentLibrary[]> {
    const choices = this.getUIComponentChoices(framework, styling);

    if (choices.length === 0) {
      return [];
    }

    const { uiComponents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'uiComponents',
        message: 'Select UI component libraries (optional):',
        choices
      }
    ]);

    return uiComponents;
  }

  private getUIComponentChoices(framework: FrontendFramework, styling: StylingFramework) {
    const choices: Array<{ name: string; value: UIComponentLibrary }> = [];

    if (framework === 'react') {
      if (styling === 'tailwind') {
        choices.push(
          { name: 'shadcn/ui', value: 'shadcn' },
          { name: 'daisyUI', value: 'daisyui' }
        );
      }

      choices.push(
        { name: 'Material-UI', value: 'material-ui' },
        { name: 'Chakra UI', value: 'chakra' },
        { name: 'Ant Design', value: 'ant-design' }
      );
    }

    return choices;
  }

  private async selectStateManagement(framework: FrontendFramework): Promise<StateManagement> {
    if (framework !== 'react' && framework !== 'vue') {
      return 'none';
    }

    const { stateManagement } = await inquirer.prompt([
      {
        type: 'list',
        name: 'stateManagement',
        message: 'Choose a state management solution:',
        choices: [
          { name: 'None', value: 'none' },
          { name: 'Zustand', value: 'zustand' },
          { name: 'Redux Toolkit', value: 'redux' },
          { name: 'Jotai', value: 'jotai' },
          { name: 'Recoil', value: 'recoil' },
          { name: 'MobX', value: 'mobx' }
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
          { name: 'TanStack Query (React Query)', value: 'tanstack-query' },
          { name: 'SWR', value: 'swr' },
          { name: 'Axios', value: 'axios' },
          { name: 'Native Fetch', value: 'fetch' }
        ]
      }
    ]);

    return apiClient;
  }

  private async selectAdditionalFeatures(framework: FrontendFramework) {
    const { features } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select additional features:',
        choices: [
          { name: 'Routing', value: 'routing', checked: true },
          { name: 'PWA Support', value: 'pwa' },
          { name: 'Testing Setup (Vitest/Jest)', value: 'testing' }
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