import { inject, injectable } from "tsyringe";
import { IBetRepository } from "./bet.repository";
import { Sequelize, Model, DataTypes, ModelStatic } from "sequelize";
import { Bet, BetWithoutId } from "../../model/bet.model";
import { Logger } from "../../service/logger/logger.service";

@injectable()
export class BetRepository implements IBetRepository {
  readonly _source: ModelStatic<Model>;
  private readonly tableName = "Bet";
  constructor(@inject(Logger) private logger: Logger) {
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
      betAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      chance: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      payout: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      win: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    });
  }

  async synchronize() {
    await this._source.sync();
    this.logger.log(`Synchronized database with table ${this.tableName}`);
  }

  async insertBet(bet: BetWithoutId): Promise<Bet> {
    const { userId, betAmount, chance, payout, win } = bet;
    const data = {
      userId,
      betAmount,
      chance,
      payout,
      win,
    };
    const b = await this._source.create(data);
    return b as unknown as Bet;
  }

  async getBet(id: number): Promise<Bet | null> {
    const bet = await this._source.findByPk(id);
    if (!bet) return null;
    return bet as unknown as Bet;
  }

  async getBetList(): Promise<Bet[]> {
    const bets = await this._source.findAll();
    return (bets as unknown as Bet[]) || [];
  }
}
