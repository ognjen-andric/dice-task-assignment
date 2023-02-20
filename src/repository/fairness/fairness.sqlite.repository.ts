import { DataTypes, Model, ModelStatic, Sequelize, where } from "sequelize";
import { inject, injectable } from "tsyringe";
import { BoilerplateFairness, FinishedFairness, HiddenFairness, ShownFairness } from "../../model/fairness.model";
import { FairnessService } from "../../service/fairness/fairness.service";
import { Logger } from "../../service/logger/logger.service";
import { IFairnessRepository } from "./fairness.repository";

@injectable()
export class FairnessRepository implements IFairnessRepository{
    readonly _source: ModelStatic<Model>;
    private readonly tableName = "Fairness";
    constructor(@inject(Logger) private logger: Logger){
        const sequelize = new Sequelize("sqlite::memory:?cache=shared");
        this._source = sequelize.define(this.tableName, {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            result: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            secret: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            hash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            gameId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        })
    }

    async synchronize() {
        await this._source.sync();
        this.logger.log(`Synchronized database with table ${this.tableName}`);
    }

    //Population
    async populate() {
        await Promise.allSettled([
            this.insertNewHash({
                userId: 1
            }),
            this.insertNewHash({
                userId: 2
            }),
            this._source.sync(),
        ]);
        this.logger.log("Populated table Fairness.");
    }
    
    async getHashFromGameId(gameId: number): Promise<FinishedFairness | null> {
        const hash = await this._source.findOne({
            where: {
                gameId
            }
        });
        if(!hash) return null;
        return hash as unknown as FinishedFairness;
    }
    async getHashFromUserId(userId: number): Promise<ShownFairness> {
        const hash = await this._source.findOne({
            where: {
                userId
            },
            order: [
                ['id', 'DESC']
            ]
        });
        return hash as unknown as ShownFairness;
    }
    async getNextHash(userId: number): Promise<HiddenFairness> {
        return await this._source.findOne({
            where: {
                userId
            },
            order: [
                ['id', 'DESC']
            ]
        }) as unknown as HiddenFairness;
    }
    async insertNewHash(fairness: BoilerplateFairness): Promise<HiddenFairness> {
        const f = FairnessService.generateSecretValues();
    
        const hash = await this._source.create({
            userId: fairness.userId,
            result: f.result,
            secret: f.secret,
            hash: f.hash
        }) as unknown as ShownFairness;

        return await this.getNextHash(fairness.userId)
    }
    async updateHash(fairness: FinishedFairness): Promise<void> {
        await this._source.update({
            gameId: fairness.gameId
        }, {
            where: {
                id: fairness.id
            }
        });
        console.log('Updated fairness id '+fairness.id);
    }
}