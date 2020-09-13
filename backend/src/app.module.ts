import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
/*import SqlConnection from "./app.mysql.connection"*/
import { ConfigModule } from "@nestjs/config"
import { Connection } from "typeorm"

import configuration from "./config/configuration"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ProvidersModule } from "./modules/providers/providers.module"
import { RayonsModule } from "./modules/rayons/rayons.module"
import { GroupsModule } from "./modules/groups/groups.module"
import { UsersModule } from "./modules/users/users.module"
import { TypeOrmModule } from "@nestjs/typeorm"

/*import { GroupRayonsModule } from "./modules/group-rayons/group-rayons.module"*/

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true
		}),
		GraphQLModule.forRoot({
			autoSchemaFile: "schema.gql",
			context: ({ req, res }) => ({ headers: req.headers })
		}),
		TypeOrmModule.forRoot({
			type: "mysql",
			host: process.env.DATABASE_HOST,
			port: 3306,
			username: process.env.DATABASE_USERNAME,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_DB,
			autoLoadEntities: true,
			synchronize: true
		}),
		ProvidersModule,
		RayonsModule,
		GroupsModule,
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {
	constructor(private connection: Connection) {
	}
}
