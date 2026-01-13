import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { FlutterConfig } from '../types/config.js';
import { Logger } from '../core/logger.js';

interface PubspecYaml {
    name: string;
    description: string;
    version: string;
    environment: {
        sdk: string;
    };
    dependencies: Record<string, string>;
    dev_dependencies: Record<string, string>;
}

export class FlutterGenerator {
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    async checkFlutterInstalled(): Promise<boolean> {
        try {
            await execa('flutter', ['--version']);
            return true;
        } catch {
            return false;
        }
    }

    async generateProject(config: FlutterConfig): Promise<void> {
        const targetDir = config.targetDirectory;

        // Check if Flutter is installed
        const isInstalled = await this.checkFlutterInstalled();
        if (!isInstalled) {
            throw new Error(
                'Flutter SDK not found. Please install Flutter first:\n' +
                'https://docs.flutter.dev/get-started/install'
            );
        }

        // Build flutter create command
        const platforms = config.platforms.join(',');
        const args = [
            'create',
            '--org', 'com.example',
            '--platforms', platforms,
            config.projectName
        ];

        // Run flutter create
        this.logger.info(`Creating Flutter project with platforms: ${platforms}`);
        await execa('flutter', args, {
            cwd: path.dirname(targetDir),
            stdio: 'inherit'
        });

        // Modify pubspec.yaml to add selected packages
        await this.modifyPubspec(config);

        // Generate boilerplate files based on selections
        await this.generateBoilerplate(config);
    }

    private async modifyPubspec(config: FlutterConfig): Promise<void> {
        const pubspecPath = path.join(config.targetDirectory, 'pubspec.yaml');
        const content = await fs.readFile(pubspecPath, 'utf-8');
        const pubspec = yaml.load(content) as PubspecYaml;

        // Add selected packages
        const packages = this.getPackages(config);

        for (const pkg of packages.dependencies) {
            pubspec.dependencies[pkg.name] = pkg.version;
        }

        for (const pkg of packages.devDependencies) {
            pubspec.dev_dependencies[pkg.name] = pkg.version;
        }

        // Write back
        const updatedContent = yaml.dump(pubspec, { lineWidth: -1 });
        await fs.writeFile(pubspecPath, updatedContent);
    }

    private getPackages(config: FlutterConfig): {
        dependencies: { name: string; version: string }[];
        devDependencies: { name: string; version: string }[];
    } {
        const dependencies: { name: string; version: string }[] = [];
        const devDependencies: { name: string; version: string }[] = [];

        // State management
        switch (config.stateManagement) {
            case 'riverpod':
                dependencies.push({ name: 'flutter_riverpod', version: '^2.4.0' });
                dependencies.push({ name: 'riverpod_annotation', version: '^2.3.0' });
                devDependencies.push({ name: 'riverpod_generator', version: '^2.3.0' });
                devDependencies.push({ name: 'build_runner', version: '^2.4.0' });
                break;
            case 'bloc':
                dependencies.push({ name: 'flutter_bloc', version: '^8.1.0' });
                dependencies.push({ name: 'bloc', version: '^8.1.0' });
                break;
            case 'provider':
                dependencies.push({ name: 'provider', version: '^6.1.0' });
                break;
            case 'getx':
                dependencies.push({ name: 'get', version: '^4.6.0' });
                break;
        }

        // Navigation
        switch (config.navigation) {
            case 'go-router':
                dependencies.push({ name: 'go_router', version: '^13.0.0' });
                break;
            case 'auto-route':
                dependencies.push({ name: 'auto_route', version: '^7.8.0' });
                devDependencies.push({ name: 'auto_route_generator', version: '^7.3.0' });
                devDependencies.push({ name: 'build_runner', version: '^2.4.0' });
                break;
        }

        // HTTP client
        switch (config.httpClient) {
            case 'dio':
                dependencies.push({ name: 'dio', version: '^5.4.0' });
                break;
            case 'http':
                dependencies.push({ name: 'http', version: '^1.2.0' });
                break;
            case 'chopper':
                dependencies.push({ name: 'chopper', version: '^7.2.0' });
                devDependencies.push({ name: 'chopper_generator', version: '^7.2.0' });
                devDependencies.push({ name: 'build_runner', version: '^2.4.0' });
                break;
        }

        // Auth
        switch (config.auth) {
            case 'firebase':
                dependencies.push({ name: 'firebase_core', version: '^2.24.0' });
                dependencies.push({ name: 'firebase_auth', version: '^4.16.0' });
                break;
            case 'supabase':
                dependencies.push({ name: 'supabase_flutter', version: '^2.3.0' });
                break;
        }

        // Remove duplicates from dev_dependencies
        const uniqueDevDeps = devDependencies.filter((dep, index, self) =>
            index === self.findIndex(d => d.name === dep.name)
        );

        return { dependencies, devDependencies: uniqueDevDeps };
    }

    private async generateBoilerplate(config: FlutterConfig): Promise<void> {
        const libDir = path.join(config.targetDirectory, 'lib');

        // Create main.dart with proper setup
        const mainContent = this.generateMainDart(config);
        await fs.writeFile(path.join(libDir, 'main.dart'), mainContent);

        // Create directory structure
        await fs.ensureDir(path.join(libDir, 'src'));
        await fs.ensureDir(path.join(libDir, 'src', 'features'));
        await fs.ensureDir(path.join(libDir, 'src', 'core'));

        // Generate router if using go_router
        if (config.navigation === 'go-router') {
            await this.generateGoRouter(config);
        }

        // Generate HTTP client wrapper
        if (config.httpClient !== 'http') {
            await this.generateHttpClient(config);
        }
    }

    private generateMainDart(config: FlutterConfig): string {
        const imports: string[] = [
            "import 'package:flutter/material.dart';"
        ];

        let appContent = '';
        let appWidget = 'const MyApp()';

        // Add state management imports and wrappers
        switch (config.stateManagement) {
            case 'riverpod':
                imports.push("import 'package:flutter_riverpod/flutter_riverpod.dart';");
                appWidget = `ProviderScope(child: ${appWidget})`;
                break;
            case 'bloc':
                imports.push("import 'package:flutter_bloc/flutter_bloc.dart';");
                break;
            case 'provider':
                imports.push("import 'package:provider/provider.dart';");
                break;
            case 'getx':
                imports.push("import 'package:get/get.dart';");
                break;
        }

        // Add navigation imports
        if (config.navigation === 'go-router') {
            imports.push("import 'src/core/router.dart';");
        }

        appContent = `
${imports.join('\n')}

void main() {
  runApp(${appWidget});
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ${config.stateManagement === 'getx' ? 'GetMaterialApp' : 'MaterialApp'}(
      title: '${config.projectName}',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      ${config.navigation === 'go-router' ? 'routerConfig: router,' : "home: const HomePage(),"}
    );
  }
}

${config.navigation !== 'go-router' ? `
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${config.projectName}'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Text('Welcome to ${config.projectName}!'),
      ),
    );
  }
}
` : ''}`;

        return appContent.trim();
    }

    private async generateGoRouter(config: FlutterConfig): Promise<void> {
        const routerContent = `
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomePage(),
    ),
  ],
);

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${config.projectName}'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Text('Welcome to ${config.projectName}!'),
      ),
    );
  }
}
`.trim();

        const coreDir = path.join(config.targetDirectory, 'lib', 'src', 'core');
        await fs.ensureDir(coreDir);
        await fs.writeFile(path.join(coreDir, 'router.dart'), routerContent);
    }

    private async generateHttpClient(config: FlutterConfig): Promise<void> {
        let clientContent = '';

        if (config.httpClient === 'dio') {
            clientContent = `
import 'package:dio/dio.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  
  late final Dio _dio;
  
  ApiClient._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: 'https://api.example.com',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));
    
    // Add interceptors
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
    ));
  }
  
  Dio get dio => _dio;
}
`.trim();
        } else if (config.httpClient === 'chopper') {
            clientContent = `
import 'package:chopper/chopper.dart';

part 'api_client.chopper.dart';

@ChopperApi()
abstract class ApiClient extends ChopperService {
  static ApiClient create([ChopperClient? client]) => _\$ApiClient(client);

  // Add your API methods here
  // @Get(path: '/users')
  // Future<Response> getUsers();
}

final chopperClient = ChopperClient(
  baseUrl: Uri.parse('https://api.example.com'),
  services: [
    ApiClient.create(),
  ],
  converter: const JsonConverter(),
);
`.trim();
        }

        if (clientContent) {
            const coreDir = path.join(config.targetDirectory, 'lib', 'src', 'core');
            await fs.ensureDir(coreDir);
            await fs.writeFile(path.join(coreDir, 'api_client.dart'), clientContent);
        }
    }
}
