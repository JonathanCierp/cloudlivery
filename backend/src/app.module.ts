import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import SqlConnection from "./app.mysql.connection"
import { ConfigModule } from "@nestjs/config"
import { Connection } from "typeorm"

import configuration from "./config/configuration"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ProvidersModule } from "./modules/providers/providers.module"
import { RayonsModule } from "./modules/rayons/rayons.module"
import { GroupsModule } from "./modules/groups/groups.module"

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true
		}),
		GraphQLModule.forRoot({
			autoSchemaFile: "schema.gql",
		}),
		SqlConnection,
		ProvidersModule,
		RayonsModule,
		GroupsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {
	constructor(private connection: Connection) {}
}
