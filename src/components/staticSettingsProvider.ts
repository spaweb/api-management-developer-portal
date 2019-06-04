import { ISettingsProvider } from "@paperbits/common/configuration";

export class StaticSettingsProvider implements ISettingsProvider {
    constructor(private readonly configuration: Object) { }

    public getSetting<T>(name: string): Promise<T> {
        return this.configuration[name];
    }

    public setSetting<T>(name: string, value: T): void {
        this.configuration[name] = value;
    }

    public async getSettings(): Promise<Object> {
        return this.configuration;
    }
}