import { EnvironmentServiceSchema } from './EnvironmentServiceModel'
import { Schema } from 'mongoose';

const DeploySchema = new Schema({
    serviceDeployed: {...EnvironmentServiceSchema.obj},
    deployedAt: Date
})

