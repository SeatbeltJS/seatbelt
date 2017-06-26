import { Decorator } from '../../helpers';
export declare namespace ConfigPlugin {
    type Init = () => any;
    type Config = (seatbelt: any) => any;
    interface BasePlugin {
        init?: Init;
        config?: Config;
    }
    interface PluginConfig {
        name: string;
    }
    function Register(config: PluginConfig): Decorator.ClassDecorator;
}
