import { container as tsyringeContainer, InjectionToken } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";

class Container {
  register = <T>(token: InjectionToken<T>, provider: constructor<T>) => {
    tsyringeContainer.register(token, provider);
    return this;
  };
  registerSingleton = <T>(from: InjectionToken<T>, to: InjectionToken<T>) => {
    tsyringeContainer.registerSingleton(from, to);
    return this;
  };
  registerInstance = <T>(from: InjectionToken<T>, value: any) => {
    tsyringeContainer.registerInstance(from, value);
  };
  resolve = <T>(token: InjectionToken<T>): T => {
    return tsyringeContainer.resolve(token);
  };
  clear = () => {
    tsyringeContainer.clearInstances();
  };
}

const container = new Container();

export { container };
