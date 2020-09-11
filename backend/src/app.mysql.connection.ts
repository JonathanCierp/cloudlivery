import { TypeOrmModule } from "@nestjs/typeorm"

export default TypeOrmModule.forRoot({
	type: "mysql",
	host: "51.77.211.195",
	port: 3306,
	username: "dev",
	password: "1Ja1meLesDev&",
	database: "cloudlivery-test",
	autoLoadEntities: true,
	synchronize: true
})