import { Sequelize, Model, DataTypes, ModelStatic } from "sequelize";
import { inject, injectable } from "tsyringe";
import { User } from "../../model/user.model";
import { Logger } from "../../service/logger/logger.service";
import { IUserRepository } from "./user.repository";

@injectable()
export class UserRepository implements IUserRepository {
  private readonly _source: ModelStatic<Model>;
  constructor(@inject(Logger) private logger: Logger) {
    const sequelize = new Sequelize("sqlite::memory:?cache=shared");

    this._source = sequelize.define("User", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
    this.logger.log("Synchronized database with table User");
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

  updateBalance(user: User, newBalance: number): Promise<void> {
    return new Promise((resolve, reject) => {
      reject("Not implemented");
    });
  }
}
