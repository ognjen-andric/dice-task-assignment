import { Sequelize, Model, DataTypes, ModelStatic } from "sequelize";
import { inject, injectable } from "tsyringe";
import { User } from "../../model/user.model";
import { Logger } from "../../service/logger/logger.service";
import { IUserRepository } from "./user.repository";

@injectable()
export class UserRepository implements IUserRepository {
  readonly _source: ModelStatic<Model>;
  private readonly tableName = "User";
  constructor(@inject(Logger) private logger: Logger) {
    const sequelize = new Sequelize("sqlite::memory:?cache=shared");

    this._source = sequelize.define(this.tableName, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  }

  async synchronize() {
    await this._source.sync();
    this.logger.log(`Synchronized database with table ${this.tableName}`);
  }

  async populate() {
    await Promise.allSettled([
      this._source.create({
        name: "Foo",
        balance: 1000,
      }),
      this._source.create({
        name: "Bar",
        balance: 200,
      }),

      this._source.sync(),
    ]);
    this.logger.log("Populated table User.");
  }

  getUser(id: number): Promise<User | null> {
    return new Promise(async (resolve, reject) => {
      const user = await this._source.findByPk(id);
      if (!user) reject(null);
      resolve(user as unknown as User);
    });
  }

  getUserList(): Promise<User[]> {
    return new Promise(async (resolve) => {
      const users = await this._source.findAll();
      resolve(users as unknown as User[]);
    });
  }

  async updateBalance(user: User, newBalance: number): Promise<User> {
    await this._source.update(
      {
        balance: newBalance,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    return (await this.getUser(user.id)) as User;
  }
}
