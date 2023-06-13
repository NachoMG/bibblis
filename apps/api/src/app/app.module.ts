import { Module } from '@nestjs/common';

import { MailerModule } from '@nestjs-modules/mailer';
import {
  HandlebarsAdapter
} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AuthModule } from '../auth/auth.module';
import { AuthorModule } from '../author/author.module';
import { BookModule } from '../book/book.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number.parseInt(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"Bibblis" <no-reply@bibblis.com>',
      },
      template: {
        dir: __dirname + '/assets/emails',
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssEnabled: false,
        }),
        options: { strict: true },
      },
    }),
    AuthModule,
    AuthorModule,
    BookModule,
    UserModule,
  ],
})
export class AppModule {}
