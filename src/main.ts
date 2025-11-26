  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
  import { ValidationPipe } from '@nestjs/common';
  import { NestExpressApplication } from '@nestjs/platform-express';
  import { join } from 'path';
  import * as dotenv from 'dotenv';

  dotenv.config();

  async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setGlobalPrefix('api/v1');

    // Configuración de CORS
    app.enableCors({
      origin: 'http://localhost:5173', // frontend Vite
      methods: 'GET,POST,PUT,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });

    app.useStaticAssets(join(__dirname, '..', 'storage'), {
      prefix: '/storage/',
      setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
        if (path.endsWith('.pdf')) {
          res.set('Content-Type', 'application/pdf');
          res.set('Accept-Ranges', 'bytes');
          res.set('Cache-Control', 'public, max-age=0');
        }
      },
    });

    // Pipes de validación global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, 
        forbidNonWhitelisted: true, 
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    
    // Configuración de Swagger
    const config = new DocumentBuilder()
      .setTitle('Sistema de Gestión de Proyectos de Grado')
      .setDescription(
        'API REST para el sistema de gestión de proyectos de grado. ' +
        'Incluye autenticación JWT, gestión de usuarios, roles, proyectos y documentos.',
      )
      .setVersion('1.0')
      .addTag('Autenticación', 'Endpoints para registro, login y gestión de sesiones')
      .addTag('Usuarios', 'Gestión de usuarios del sistema')
      .addTag('Roles', 'Gestión de roles y permisos')
      .addTag('Proyectos', 'Gestión de proyectos de grado')
      .addTag('Documentos', 'Gestión de documentos asociados a proyectos')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingrese el token JWT',
          in: 'header',
        },
        'JWT-auth',
      )
      .addServer('http://localhost:3000', 'Servidor de Desarrollo')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'API Docs - Sistema GPG',
    });

    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);

    console.log('\n Servidor iniciado exitosamente');
    console.log(`API disponible en: http://localhost:${PORT}/api/v1`);
    console.log(`Documentación Swagger: http://localhost:${PORT}/api/docs`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}\n`);
}
  bootstrap();
