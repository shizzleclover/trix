import inquirer from 'inquirer';
import {
    MobileFramework,
    MobileNavigation,
    MobileStyling,
    MobileStateManagement,
    MobileAPIClient,
    MobileAuthProvider,
    FlutterStateManagement,
    FlutterNavigation,
    FlutterHttpClient,
    FlutterAuthProvider
} from '../../types/index.js';

export class MobilePrompts {
    async collect() {
        const framework = await this.selectFramework();

        // Flutter has a different prompt flow
        if (framework === 'flutter') {
            return this.collectFlutterOptions();
        }

        // React Native flow
        return this.collectReactNativeOptions(framework);
    }

    private async collectReactNativeOptions(framework: MobileFramework) {
        const navigation = await this.selectNavigation(framework);
        const styling = await this.selectStyling();
        const stateManagement = await this.selectStateManagement();
        const apiClient = await this.selectAPIClient();
        const auth = await this.selectAuth();
        const testing = await this.selectTesting('React Native Testing Library');

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

    private async collectFlutterOptions() {
        const architecture = await this.selectFlutterArchitecture();
        const stateManagement = await this.selectFlutterStateManagement();
        const navigation = await this.selectFlutterNavigation();
        const httpClient = await this.selectFlutterHttpClient();
        const auth = await this.selectFlutterAuth();
        const platforms = await this.selectFlutterPlatforms();
        const testing = await this.selectTesting('Flutter test');

        return {
            projectType: 'mobile' as const,
            framework: 'flutter' as const,
            architecture,
            stateManagement,
            navigation,
            httpClient,
            auth,
            platforms,
            testing
        };
    }

    private async selectFlutterArchitecture(): Promise<'clean' | 'simple' | 'feature-first' | 'mvc'> {
        const { architecture } = await inquirer.prompt([
            {
                type: 'list',
                name: 'architecture',
                message: 'Choose an architecture pattern:',
                choices: [
                    { name: 'Clean Architecture (Recommended)', value: 'clean' },
                    { name: 'Feature-First (Simpler)', value: 'feature-first' },
                    { name: 'MVC (Model-View-Controller)', value: 'mvc' },
                    { name: 'Simple (Basic folders)', value: 'simple' }
                ]
            }
        ]);

        return architecture;
    }

    private async selectFramework(): Promise<MobileFramework> {
        const { framework } = await inquirer.prompt([
            {
                type: 'list',
                name: 'framework',
                message: 'Choose a mobile framework:',
                choices: [
                    { name: 'Expo (Recommended)', value: 'expo' },
                    { name: 'React Native CLI', value: 'react-native-cli' },
                    { name: 'Flutter (Dart)', value: 'flutter' }
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

    // Flutter-specific prompts
    private async selectFlutterStateManagement(): Promise<FlutterStateManagement> {
        const { stateManagement } = await inquirer.prompt([
            {
                type: 'list',
                name: 'stateManagement',
                message: 'Choose a state management solution:',
                choices: [
                    { name: 'None', value: 'none' },
                    { name: 'Riverpod (Recommended)', value: 'riverpod' },
                    { name: 'Bloc', value: 'bloc' },
                    { name: 'Provider', value: 'provider' },
                    { name: 'GetX', value: 'getx' }
                ]
            }
        ]);

        return stateManagement;
    }

    private async selectFlutterNavigation(): Promise<FlutterNavigation> {
        const { navigation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'navigation',
                message: 'Choose a navigation solution:',
                choices: [
                    { name: 'None (Navigator 2.0)', value: 'none' },
                    { name: 'go_router (Recommended)', value: 'go-router' },
                    { name: 'auto_route', value: 'auto-route' }
                ]
            }
        ]);

        return navigation;
    }

    private async selectFlutterHttpClient(): Promise<FlutterHttpClient> {
        const { httpClient } = await inquirer.prompt([
            {
                type: 'list',
                name: 'httpClient',
                message: 'Choose an HTTP client:',
                choices: [
                    { name: 'Dio (Recommended)', value: 'dio' },
                    { name: 'http (Dart standard)', value: 'http' },
                    { name: 'Chopper (Retrofit-like)', value: 'chopper' }
                ]
            }
        ]);

        return httpClient;
    }

    private async selectFlutterAuth(): Promise<FlutterAuthProvider> {
        const { auth } = await inquirer.prompt([
            {
                type: 'list',
                name: 'auth',
                message: 'Choose an authentication provider:',
                choices: [
                    { name: 'None', value: 'none' },
                    { name: 'Firebase Auth', value: 'firebase' },
                    { name: 'Supabase Auth', value: 'supabase' }
                ]
            }
        ]);

        return auth;
    }

    private async selectFlutterPlatforms(): Promise<('android' | 'ios' | 'web' | 'windows' | 'macos' | 'linux')[]> {
        const { platforms } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'platforms',
                message: 'Select target platforms:',
                choices: [
                    { name: 'Android', value: 'android', checked: true },
                    { name: 'iOS', value: 'ios', checked: true },
                    { name: 'Web', value: 'web', checked: false },
                    { name: 'Windows', value: 'windows', checked: false },
                    { name: 'macOS', value: 'macos', checked: false },
                    { name: 'Linux', value: 'linux', checked: false }
                ],
                validate: (input: string[]) => {
                    if (input.length === 0) {
                        return 'Please select at least one platform';
                    }
                    return true;
                }
            }
        ]);

        return platforms;
    }

    private async selectTesting(testFramework: string): Promise<boolean> {
        const { testing } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'testing',
                message: `Include testing setup (${testFramework})?`,
                default: false
            }
        ]);

        return testing;
    }
}
