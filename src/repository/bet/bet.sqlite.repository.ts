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
    const b = await this._source.create(data) as unknown as Bet;
    this.logger.log(`Inserted new bet by id : ${b.id}`);
    return b
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

  async getBestBetPerUser(limit?: number): Promise<Bet[]> {
    /**
     * Performance of this is not best and should not be done like this.
     * This is the approach because my previous solution with using the sequelize to handle logic gave wrong results for whatever reason.
     * Will look into this one if I find time today, if not, at least know that I am aware that better solution would be to use ORM features for it
     * 
     * Performance downsides of this :
     * - Gets all content (VERY slow on large tables, sometimes impossible)
     * - Loops through them
     * - Loops through them 2x :(
     * 
     * At least in my head, it should be possible to achieve this with only SQL, but no time to explore it tbh
     */
    const results: Record<string, Bet> = {};
    const games = await this._source.findAll();
    games.forEach(game => {
      const updateBestGame = () => {
        results[game.dataValues.userId] = game.dataValues
      }
      if(!results[game.dataValues.userId]) updateBestGame();
      if(results[game.dataValues.userId].payout < game.dataValues.payout) updateBestGame();
    });

    const sorted = Object.values(results).sort((a, b) => b.payout - a.payout);
    const limited = sorted.slice(0, limit || Infinity);

    
    return limited as unknown as Bet[];
  }
}
