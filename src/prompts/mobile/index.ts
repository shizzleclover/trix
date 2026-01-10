import inquirer from 'inquirer';
import {
    MobileFramework,
    MobileNavigation,
    MobileStyling,
    MobileStateManagement,
    MobileAPIClient,
    MobileAuthProvider
} from '../../types/index.js';

export class MobilePrompts {
    async collect() {
        const framework = await this.selectFramework();
        const navigation = await this.selectNavigation(framework);
        const styling = await this.selectStyling();
        const stateManagement = await this.selectStateManagement();
        const apiClient = await this.selectAPIClient();
        const auth = await this.selectAuth();
        const testing = await this.selectTesting();

        return {
            projectType: 'mobile' as const,
            framework,
            navigation,
            styling,
            stateManagement,
            apiClient,
            auth,
            testing
        };
    }

    private async selectFramework(): Promise<MobileFramework> {
        const { framework } = await inquirer.prompt([
            {
                type: 'list',
                name: 'framework',
                message: 'Choose a mobile framework:',
                choices: [
                    { name: 'Expo (Recommended)', value: 'expo' },
                    { name: 'React Native CLI', value: 'react-native-cli' }
                ]
            }
        ]);

        return framework;
    }

    private async selectNavigation(framework: MobileFramework): Promise<MobileNavigation> {
        const choices = this.getNavigationChoices(framework);

        const { navigation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'navigation',
                message: 'Choose a navigation solution:',
                choices
            }
        ]);

        return navigation;
    }

    private getNavigationChoices(framework: MobileFramework): Array<{ name: string; value: MobileNavigation }> {
        const choices: Array<{ name: string; value: MobileNavigation }> = [
            { name: 'React Navigation', value: 'react-navigation' },
            { name: 'None', value: 'none' }
        ];

        // Expo Router is only available for Expo projects
        if (framework === 'expo') {
            choices.splice(1, 0, { name: 'Expo Router (File-based)', value: 'expo-router' });
        }

        return choices;
    }

    private async selectStyling(): Promise<MobileStyling> {
        const { styling } = await inquirer.prompt([
            {
                type: 'list',
                name: 'styling',
                message: 'Choose a styling solution:',
                choices: [
                    { name: 'NativeWind (Tailwind for RN)', value: 'nativewind' },
                    { name: 'Tamagui (Universal UI)', value: 'tamagui' },
                    { name: 'Styled Components', value: 'styled-components' },
                    { name: 'Vanilla StyleSheet', value: 'vanilla' }
                ]
            }
        ]);

        return styling;
    }

    private async selectStateManagement(): Promise<MobileStateManagement> {
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
                    { name: 'MobX', value: 'mobx' },
                    { name: 'Recoil', value: 'recoil' },
                    { name: 'Legend State', value: 'legend-state' }
                ]
            }
        ]);

        return stateManagement;
    }

    private async selectAPIClient(): Promise<MobileAPIClient> {
        const { apiClient } = await inquirer.prompt([
            {
                type: 'list',
                name: 'apiClient',
                message: 'Choose an HTTP client for API calls:',
                choices: [
                    { name: 'TanStack Query (React Query)', value: 'tanstack-query' },
                    { name: 'Axios', value: 'axios' },
                    { name: 'ky (Lightweight)', value: 'ky' },
                    { name: 'Native Fetch', value: 'fetch' }
                ]
            }
        ]);

        return apiClient;
    }

    private async selectAuth(): Promise<MobileAuthProvider> {
        const { auth } = await inquirer.prompt([
            {
                type: 'list',
                name: 'auth',
                message: 'Choose an authentication provider:',
                choices: [
                    { name: 'None', value: 'none' },
                    { name: 'Clerk', value: 'clerk' },
                    { name: 'Supabase Auth', value: 'supabase' },
                    { name: 'Firebase Auth', value: 'firebase' }
                ]
            }
        ]);

        return auth;
    }

    private async selectTesting(): Promise<boolean> {
        const { testing } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'testing',
                message: 'Include testing setup (Jest + React Native Testing Library)?',
                default: false
            }
        ]);

        return testing;
    }
}
