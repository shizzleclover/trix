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

    // Generate architecture-based boilerplate
    switch (config.architecture) {
      case 'clean':
        await this.generateCleanArchitecture(config);
        break;
      case 'feature-first':
        await this.generateFeatureFirstArchitecture(config);
        break;
      case 'mvc':
        await this.generateMVCArchitecture(config);
        break;
      case 'simple':
      default:
        await this.generateSimpleArchitecture(config);
        break;
    }
  }

  private async modifyPubspec(config: FlutterConfig): Promise<void> {
    const pubspecPath = path.join(config.targetDirectory, 'pubspec.yaml');
    const content = await fs.readFile(pubspecPath, 'utf-8');
    const pubspec = yaml.load(content) as PubspecYaml;

    // Add architecture-specific packages
    if (config.architecture === 'clean' || config.architecture === 'feature-first') {
      pubspec.dependencies['dartz'] = '^0.10.1';
      pubspec.dependencies['equatable'] = '^2.0.5';
      pubspec.dependencies['get_it'] = '^7.6.4';
      pubspec.dependencies['injectable'] = '^2.3.2';
    } else if (config.architecture === 'mvc') {
      pubspec.dependencies['get_it'] = '^7.6.4';
    }

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

    // Always add injectable_generator for DI
    devDependencies.push({ name: 'injectable_generator', version: '^2.4.1' });
    devDependencies.push({ name: 'build_runner', version: '^2.4.0' });

    // State management
    switch (config.stateManagement) {
      case 'riverpod':
        dependencies.push({ name: 'flutter_riverpod', version: '^2.4.0' });
        dependencies.push({ name: 'riverpod_annotation', version: '^2.3.0' });
        devDependencies.push({ name: 'riverpod_generator', version: '^2.3.0' });
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

    // Remove duplicates
    const uniqueDevDeps = devDependencies.filter((dep, index, self) =>
      index === self.findIndex(d => d.name === dep.name)
    );

    return { dependencies, devDependencies: uniqueDevDeps };
  }

  private async generateCleanArchitecture(config: FlutterConfig): Promise<void> {
    const libDir = path.join(config.targetDirectory, 'lib');

    // Create Clean Architecture directory structure
    // Core layer
    await fs.ensureDir(path.join(libDir, 'core', 'constants'));
    await fs.ensureDir(path.join(libDir, 'core', 'error'));
    await fs.ensureDir(path.join(libDir, 'core', 'network'));
    await fs.ensureDir(path.join(libDir, 'core', 'usecases'));
    await fs.ensureDir(path.join(libDir, 'core', 'utils'));
    await fs.ensureDir(path.join(libDir, 'core', 'theme'));
    await fs.ensureDir(path.join(libDir, 'core', 'routes'));

    // Feature-based structure (example: auth feature)
    await fs.ensureDir(path.join(libDir, 'features', 'auth', 'data', 'datasources'));
    await fs.ensureDir(path.join(libDir, 'features', 'auth', 'data', 'models'));
    await fs.ensureDir(path.join(libDir, 'features', 'auth', 'data', 'repositories'));
    await fs.ensureDir(path.join(libDir, 'features', 'auth', 'domain', 'entities'));
    await fs.ensureDir(path.join(libDir, 'features', 'auth', 'domain', 'repositories'));
    await fs.ensureDir(path.join(libDir, 'features', 'auth', 'domain', 'usecases'));
    await fs.ensureDir(path.join(libDir, 'features', 'auth', 'presentation', 'bloc'));
    await fs.ensureDir(path.join(libDir, 'features', 'auth', 'presentation', 'pages'));
    await fs.ensureDir(path.join(libDir, 'features', 'auth', 'presentation', 'widgets'));

    // Home feature
    await fs.ensureDir(path.join(libDir, 'features', 'home', 'data', 'datasources'));
    await fs.ensureDir(path.join(libDir, 'features', 'home', 'data', 'models'));
    await fs.ensureDir(path.join(libDir, 'features', 'home', 'data', 'repositories'));
    await fs.ensureDir(path.join(libDir, 'features', 'home', 'domain', 'entities'));
    await fs.ensureDir(path.join(libDir, 'features', 'home', 'domain', 'repositories'));
    await fs.ensureDir(path.join(libDir, 'features', 'home', 'domain', 'usecases'));
    await fs.ensureDir(path.join(libDir, 'features', 'home', 'presentation', 'bloc'));
    await fs.ensureDir(path.join(libDir, 'features', 'home', 'presentation', 'pages'));
    await fs.ensureDir(path.join(libDir, 'features', 'home', 'presentation', 'widgets'));

    // Generate core files
    await this.generateCoreFiles(config, libDir);

    // Generate main.dart
    await this.generateMainDart(config, libDir);

    // Generate feature files
    await this.generateFeatureFiles(config, libDir);

    // Generate router if using go_router or auto_route
    if (config.navigation === 'go-router') {
      await this.generateGoRouter(config, libDir);
    } else if (config.navigation === 'auto-route') {
      await this.generateAutoRoute(config, libDir);
    }

    // Generate HTTP client
    await this.generateNetworkLayer(config, libDir);

    // Generate DI setup
    await this.generateDependencyInjection(config, libDir);
  }

  private async generateCoreFiles(config: FlutterConfig, libDir: string): Promise<void> {
    // Core constants
    const constantsContent = `
class AppConstants {
  static const String appName = '${config.projectName}';
  static const String baseUrl = 'https://api.example.com';
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}

class StorageKeys {
  static const String token = 'auth_token';
  static const String refreshToken = 'refresh_token';
  static const String user = 'user_data';
}
`.trim();
    await fs.writeFile(path.join(libDir, 'core', 'constants', 'app_constants.dart'), constantsContent);

    // Core error handling
    const failureContent = `
import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  final int? code;

  const Failure({required this.message, this.code});

  @override
  List<Object?> get props => [message, code];
}

class ServerFailure extends Failure {
  const ServerFailure({required super.message, super.code});
}

class CacheFailure extends Failure {
  const CacheFailure({required super.message, super.code});
}

class NetworkFailure extends Failure {
  const NetworkFailure({required super.message, super.code});
}

class ValidationFailure extends Failure {
  const ValidationFailure({required super.message, super.code});
}
`.trim();
    await fs.writeFile(path.join(libDir, 'core', 'error', 'failures.dart'), failureContent);

    const exceptionsContent = `
class ServerException implements Exception {
  final String message;
  final int? statusCode;

  const ServerException({required this.message, this.statusCode});
}

class CacheException implements Exception {
  final String message;

  const CacheException({required this.message});
}

class NetworkException implements Exception {
  final String message;

  const NetworkException({required this.message});
}
`.trim();
    await fs.writeFile(path.join(libDir, 'core', 'error', 'exceptions.dart'), exceptionsContent);

    // Base usecase
    const usecaseContent = `
import 'package:dartz/dartz.dart';
import '../error/failures.dart';

abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

class NoParams {
  const NoParams();
}
`.trim();
    await fs.writeFile(path.join(libDir, 'core', 'usecases', 'usecase.dart'), usecaseContent);

    // Theme
    const themeContent = `
import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.deepPurple,
        brightness: Brightness.light,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.deepPurple,
        brightness: Brightness.dark,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
    );
  }
}
`.trim();
    await fs.writeFile(path.join(libDir, 'core', 'theme', 'app_theme.dart'), themeContent);
  }

  private async generateMainDart(config: FlutterConfig, libDir: string): Promise<void> {
    const imports: string[] = [
      "import 'package:flutter/material.dart';",
      "import 'core/theme/app_theme.dart';",
      "import 'injection_container.dart';",
    ];

    let appWidget = 'const MyApp()';
    let routerSetup = "home: const HomePage(),";
    let additionalImports = '';

    // State management setup
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

    // Navigation setup
    if (config.navigation === 'go-router') {
      imports.push("import 'core/routes/app_router.dart';");
      routerSetup = "routerConfig: appRouter,";
    } else if (config.navigation === 'auto-route') {
      imports.push("import 'core/routes/app_router.dart';");
      routerSetup = "routerConfig: _appRouter.config(),";
      additionalImports = "final _appRouter = AppRouter();";
    } else {
      imports.push("import 'features/home/presentation/pages/home_page.dart';");
    }

    const materialApp = config.stateManagement === 'getx' ? 'GetMaterialApp' : 'MaterialApp';
    const routerMethod = config.navigation !== 'none' ? '.router' : '';

    const mainContent = `
${imports.join('\n')}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await configureDependencies();
  runApp(${appWidget});
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    ${additionalImports}
    return ${materialApp}${routerMethod}(
      title: '${config.projectName}',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      ${routerSetup}
    );
  }
}
`.trim();

    await fs.writeFile(path.join(libDir, 'main.dart'), mainContent);
  }

  private async generateFeatureFiles(config: FlutterConfig, libDir: string): Promise<void> {
    // Home page
    const homePageContent = `
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${config.projectName}'),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.home, size: 64),
            SizedBox(height: 16),
            Text(
              'Welcome to ${config.projectName}!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              'Built with Clean Architecture',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
`.trim();
    await fs.writeFile(path.join(libDir, 'features', 'home', 'presentation', 'pages', 'home_page.dart'), homePageContent);

    // Example entity
    const userEntityContent = `
import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String email;
  final String? name;
  final String? photoUrl;

  const User({
    required this.id,
    required this.email,
    this.name,
    this.photoUrl,
  });

  @override
  List<Object?> get props => [id, email, name, photoUrl];
}
`.trim();
    await fs.writeFile(path.join(libDir, 'features', 'auth', 'domain', 'entities', 'user.dart'), userEntityContent);

    // Example model
    const userModelContent = `
import '../../domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required super.id,
    required super.email,
    super.name,
    super.photoUrl,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String?,
      photoUrl: json['photo_url'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'photo_url': photoUrl,
    };
  }
}
`.trim();
    await fs.writeFile(path.join(libDir, 'features', 'auth', 'data', 'models', 'user_model.dart'), userModelContent);

    // Example repository interface
    const authRepoInterfaceContent = `
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, User>> signIn({
    required String email,
    required String password,
  });

  Future<Either<Failure, User>> signUp({
    required String email,
    required String password,
    String? name,
  });

  Future<Either<Failure, void>> signOut();

  Future<Either<Failure, User?>> getCurrentUser();
}
`.trim();
    await fs.writeFile(path.join(libDir, 'features', 'auth', 'domain', 'repositories', 'auth_repository.dart'), authRepoInterfaceContent);

    // Example use case
    const signInUsecaseContent = `
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class SignInUseCase implements UseCase<User, SignInParams> {
  final AuthRepository repository;

  SignInUseCase(this.repository);

  @override
  Future<Either<Failure, User>> call(SignInParams params) {
    return repository.signIn(
      email: params.email,
      password: params.password,
    );
  }
}

class SignInParams {
  final String email;
  final String password;

  const SignInParams({required this.email, required this.password});
}
`.trim();
    await fs.writeFile(path.join(libDir, 'features', 'auth', 'domain', 'usecases', 'sign_in_usecase.dart'), signInUsecaseContent);
  }

  private async generateGoRouter(config: FlutterConfig, libDir: string): Promise<void> {
    const routerContent = `
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/home/presentation/pages/home_page.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  debugLogDiagnostics: true,
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomePage(),
    ),
    // Add more routes here
    // GoRoute(
    //   path: '/profile',
    //   name: 'profile',
    //   builder: (context, state) => const ProfilePage(),
    // ),
  ],
  errorBuilder: (context, state) => Scaffold(
    body: Center(
      child: Text('Page not found: \${state.uri}'),
    ),
  ),
);
`.trim();
    await fs.writeFile(path.join(libDir, 'core', 'routes', 'app_router.dart'), routerContent);
  }

  private async generateAutoRoute(config: FlutterConfig, libDir: string): Promise<void> {
    const routerContent = `
import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

part 'app_router.gr.dart';

@AutoRouterConfig()
class AppRouter extends _$AppRouter {
  @override
  List<AutoRoute> get routes => [
    AutoRoute(page: HomeRoute.page, initial: true),
    // Add more routes here
  ];
}

@RoutePage()
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${config.projectName}')),
      body: const Center(
        child: Text('Welcome to ${config.projectName}!'),
      ),
    );
  }
}
`.trim();
    await fs.writeFile(path.join(libDir, 'core', 'routes', 'app_router.dart'), routerContent);
  }

  private async generateNetworkLayer(config: FlutterConfig, libDir: string): Promise<void> {
    let clientContent = '';

    if (config.httpClient === 'dio') {
      clientContent = `
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import '../constants/app_constants.dart';

@lazySingleton
class ApiClient {
  final Dio _dio;

  ApiClient() : _dio = Dio(BaseOptions(
    baseUrl: AppConstants.baseUrl,
    connectTimeout: AppConstants.connectionTimeout,
    receiveTimeout: AppConstants.receiveTimeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  )) {
    _dio.interceptors.addAll([
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        error: true,
      ),
      _AuthInterceptor(),
    ]);
  }

  Dio get dio => _dio;

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.get<T>(path, queryParameters: queryParameters, options: options);
  }

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.post<T>(path, data: data, queryParameters: queryParameters, options: options);
  }

  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.put<T>(path, data: data, queryParameters: queryParameters, options: options);
  }

  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.delete<T>(path, data: data, queryParameters: queryParameters, options: options);
  }
}

class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // Add auth token to requests
    // final token = await getToken();
    // if (token != null) {
    //   options.headers['Authorization'] = 'Bearer \$token';
    // }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Handle 401 errors (refresh token, logout, etc.)
    if (err.response?.statusCode == 401) {
      // Handle unauthorized
    }
    handler.next(err);
  }
}
`.trim();
    } else if (config.httpClient === 'http') {
      clientContent = `
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:injectable/injectable.dart';
import '../constants/app_constants.dart';
import '../error/exceptions.dart';

@lazySingleton
class ApiClient {
  final http.Client _client;

  ApiClient() : _client = http.Client();

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  Future<dynamic> get(String path, {Map<String, dynamic>? queryParameters}) async {
    final uri = Uri.parse('\${AppConstants.baseUrl}\$path').replace(queryParameters: queryParameters?.map((k, v) => MapEntry(k, v.toString())));
    
    final response = await _client.get(uri, headers: _headers);
    return _handleResponse(response);
  }

  Future<dynamic> post(String path, {dynamic data}) async {
    final uri = Uri.parse('\${AppConstants.baseUrl}\$path');
    
    final response = await _client.post(
      uri,
      headers: _headers,
      body: json.encode(data),
    );
    return _handleResponse(response);
  }

  Future<dynamic> put(String path, {dynamic data}) async {
    final uri = Uri.parse('\${AppConstants.baseUrl}\$path');
    
    final response = await _client.put(
      uri,
      headers: _headers,
      body: json.encode(data),
    );
    return _handleResponse(response);
  }

  Future<dynamic> delete(String path) async {
    final uri = Uri.parse('\${AppConstants.baseUrl}\$path');
    
    final response = await _client.delete(uri, headers: _headers);
    return _handleResponse(response);
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return json.decode(response.body);
    } else {
      throw ServerException(
        message: 'Server error',
        statusCode: response.statusCode,
      );
    }
  }
}
`.trim();
    } else if (config.httpClient === 'chopper') {
      clientContent = `
import 'package:chopper/chopper.dart';
import 'package:injectable/injectable.dart';
import '../constants/app_constants.dart';

part 'api_client.chopper.dart';

@ChopperApi()
abstract class ApiService extends ChopperService {
  static ApiService create([ChopperClient? client]) => _\$ApiService(client);

  // Example endpoints - add your API methods here
  // @Get(path: '/users')
  // Future<Response<List<dynamic>>> getUsers();
  
  // @Get(path: '/users/{id}')
  // Future<Response<dynamic>> getUser(@Path('id') String id);
  
  // @Post(path: '/users')
  // Future<Response<dynamic>> createUser(@Body() Map<String, dynamic> body);
}

@lazySingleton
class ApiClient {
  late final ChopperClient _client;
  late final ApiService _apiService;

  ApiClient() {
    _client = ChopperClient(
      baseUrl: Uri.parse(AppConstants.baseUrl),
      services: [
        ApiService.create(),
      ],
      converter: const JsonConverter(),
      interceptors: [
        HttpLoggingInterceptor(),
        // Add auth interceptor here
      ],
    );
    _apiService = _client.getService<ApiService>();
  }

  ApiService get service => _apiService;
}
`.trim();
    }

    if (clientContent) {
      await fs.writeFile(path.join(libDir, 'core', 'network', 'api_client.dart'), clientContent);
    }
  }

  private async generateDependencyInjection(config: FlutterConfig, libDir: string): Promise<void> {
    const injectionContent = `
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';

import 'injection_container.config.dart';

final getIt = GetIt.instance;

@InjectableInit(
  initializerName: 'init',
  preferRelativeImports: true,
  asExtension: true,
)
Future<void> configureDependencies() async => getIt.init();
`.trim();
    await fs.writeFile(path.join(libDir, 'injection_container.dart'), injectionContent);

    // Add README for DI setup
    const readmeContent = `
# Dependency Injection Setup

This project uses \`get_it\` and \`injectable\` for dependency injection.

## Generate DI code

Run the following command to generate the injection container:

\`\`\`bash
flutter pub run build_runner build --delete-conflicting-outputs
\`\`\`

## Usage

1. Annotate your classes with \`@injectable\`, \`@lazySingleton\`, or \`@singleton\`
2. Run the build_runner command above
3. Access dependencies using \`getIt<YourClass>()\`

## Example

\`\`\`dart
@lazySingleton
class MyService {
  // ...
}

// Usage
final myService = getIt<MyService>();
\`\`\`
`.trim();
    await fs.writeFile(path.join(libDir, 'injection_container_readme.md'), readmeContent);
  }

  // ============================================
  // Feature-First Architecture
  // ============================================
  private async generateFeatureFirstArchitecture(config: FlutterConfig): Promise<void> {
    const libDir = path.join(config.targetDirectory, 'lib');

    // Create directory structure
    await fs.ensureDir(path.join(libDir, 'core', 'theme'));
    await fs.ensureDir(path.join(libDir, 'core', 'utils'));
    await fs.ensureDir(path.join(libDir, 'core', 'widgets'));
    await fs.ensureDir(path.join(libDir, 'core', 'constants'));
    await fs.ensureDir(path.join(libDir, 'core', 'routes'));
    await fs.ensureDir(path.join(libDir, 'features', 'home'));
    await fs.ensureDir(path.join(libDir, 'features', 'auth'));
    await fs.ensureDir(path.join(libDir, 'services'));
    await fs.ensureDir(path.join(libDir, 'models'));

    // Generate files
    await this.generateCoreFiles(config, libDir);
    await this.generateMainDart(config, libDir);

    // Simple feature structure
    const homePageContent = `
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${config.projectName}')),
      body: const Center(
        child: Text('Welcome to ${config.projectName}!'),
      ),
    );
  }
}
`.trim();
    await fs.writeFile(path.join(libDir, 'features', 'home', 'home_screen.dart'), homePageContent);

    if (config.navigation === 'go-router') {
      await this.generateGoRouter(config, libDir);
    }

    if (config.httpClient !== 'http') {
      await this.generateNetworkLayer(config, libDir);
    }
  }

  // ============================================
  // MVC Architecture
  // ============================================
  private async generateMVCArchitecture(config: FlutterConfig): Promise<void> {
    const libDir = path.join(config.targetDirectory, 'lib');

    // Create MVC directory structure
    await fs.ensureDir(path.join(libDir, 'models'));
    await fs.ensureDir(path.join(libDir, 'views', 'screens'));
    await fs.ensureDir(path.join(libDir, 'views', 'widgets'));
    await fs.ensureDir(path.join(libDir, 'controllers'));
    await fs.ensureDir(path.join(libDir, 'services'));
    await fs.ensureDir(path.join(libDir, 'utils'));
    await fs.ensureDir(path.join(libDir, 'config'));

    // Generate main.dart
    await this.generateMVCMainDart(config, libDir);

    // Generate example files
    const userModelContent = `
class UserModel {
  final String id;
  final String email;
  final String? name;

  UserModel({
    required this.id,
    required this.email,
    this.name,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
    };
  }
}
`.trim();
    await fs.writeFile(path.join(libDir, 'models', 'user_model.dart'), userModelContent);

    const homeScreenContent = `
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${config.projectName}'),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.home, size: 64),
            SizedBox(height: 16),
            Text(
              'Welcome!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
`.trim();
    await fs.writeFile(path.join(libDir, 'views', 'screens', 'home_screen.dart'), homeScreenContent);

    const homeControllerContent = `
import 'package:get_it/get_it.dart';

class HomeController {
  // Add your controller logic here
  
  Future<void> loadData() async {
    // Load data from services
  }
}

// Register in main.dart
// GetIt.I.registerSingleton<HomeController>(HomeController());
`.trim();
    await fs.writeFile(path.join(libDir, 'controllers', 'home_controller.dart'), homeControllerContent);

    const appConfigContent = `
class AppConfig {
  static const String appName = '${config.projectName}';
  static const String baseUrl = 'https://api.example.com';
}
`.trim();
    await fs.writeFile(path.join(libDir, 'config', 'app_config.dart'), appConfigContent);

    if (config.httpClient !== 'http') {
      await fs.ensureDir(path.join(libDir, 'services'));
      await this.generateSimpleApiService(config, libDir);
    }
  }

  private async generateMVCMainDart(config: FlutterConfig, libDir: string): Promise<void> {
    const imports: string[] = [
      "import 'package:flutter/material.dart';",
      "import 'views/screens/home_screen.dart';",
    ];

    if (config.stateManagement === 'getx') {
      imports.push("import 'package:get/get.dart';");
    }

    const materialApp = config.stateManagement === 'getx' ? 'GetMaterialApp' : 'MaterialApp';

    const mainContent = `
${imports.join('\n')}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ${materialApp}(
      title: '${config.projectName}',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
`.trim();

    await fs.writeFile(path.join(libDir, 'main.dart'), mainContent);
  }

  private async generateSimpleApiService(config: FlutterConfig, libDir: string): Promise<void> {
    let content = '';

    if (config.httpClient === 'dio') {
      content = `
import 'package:dio/dio.dart';
import '../config/app_config.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  late final Dio _dio;

  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConfig.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));
  }

  Future<Response> get(String path) => _dio.get(path);
  Future<Response> post(String path, {dynamic data}) => _dio.post(path, data: data);
  Future<Response> put(String path, {dynamic data}) => _dio.put(path, data: data);
  Future<Response> delete(String path) => _dio.delete(path);
}
`.trim();
    }

    if (content) {
      await fs.writeFile(path.join(libDir, 'services', 'api_service.dart'), content);
    }
  }

  // ============================================
  // Simple Architecture
  // ============================================
  private async generateSimpleArchitecture(config: FlutterConfig): Promise<void> {
    const libDir = path.join(config.targetDirectory, 'lib');

    // Create simple directory structure
    await fs.ensureDir(path.join(libDir, 'screens'));
    await fs.ensureDir(path.join(libDir, 'widgets'));
    await fs.ensureDir(path.join(libDir, 'models'));
    await fs.ensureDir(path.join(libDir, 'services'));
    await fs.ensureDir(path.join(libDir, 'utils'));

    // Generate main.dart
    await this.generateSimpleMainDart(config, libDir);

    // Generate home screen
    const homeScreenContent = `
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${config.projectName}'),
      ),
      body: const Center(
        child: Text('Welcome to ${config.projectName}!'),
      ),
    );
  }
}
`.trim();
    await fs.writeFile(path.join(libDir, 'screens', 'home_screen.dart'), homeScreenContent);
  }

  private async generateSimpleMainDart(config: FlutterConfig, libDir: string): Promise<void> {
    const imports: string[] = [
      "import 'package:flutter/material.dart';",
      "import 'screens/home_screen.dart';",
    ];

    let appWidget = 'const MyApp()';

    switch (config.stateManagement) {
      case 'riverpod':
        imports.push("import 'package:flutter_riverpod/flutter_riverpod.dart';");
        appWidget = `ProviderScope(child: ${appWidget})`;
        break;
      case 'getx':
        imports.push("import 'package:get/get.dart';");
        break;
    }

    const materialApp = config.stateManagement === 'getx' ? 'GetMaterialApp' : 'MaterialApp';

    const mainContent = `
${imports.join('\n')}

void main() {
  runApp(${appWidget});
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ${materialApp}(
      title: '${config.projectName}',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
`.trim();

    await fs.writeFile(path.join(libDir, 'main.dart'), mainContent);
  }
}

