import { App, PluginSettingTab, Setting } from 'obsidian';
import RandomNoteNameGenerator from './main';

export interface RandomNoteNameGeneratorSettings {
    length: number;
    useUppercase: boolean;
    useLowercase: boolean;
    useNumbers: boolean;
    useSymbols: boolean;
}

export const DEFAULT_SETTINGS: RandomNoteNameGeneratorSettings = {
    length: 10,
    useUppercase: true,
    useLowercase: true,
    useNumbers: false,
    useSymbols: false,
};

export class RandomNoteNameGeneratorSettingTab extends PluginSettingTab {
    plugin: RandomNoteNameGenerator;

    constructor(app: App, plugin: RandomNoteNameGenerator) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Random Note Name Generator Settings' });

        new Setting(containerEl)
            .setName('Length')
            .setDesc('Number of characters in the random string')
            .addText((text) =>
                text
                    .setPlaceholder('Length')
                    .setValue(this.plugin.settings.length.toString())
                    .onChange(async (value) => {
                        this.plugin.settings.length = parseInt(value, 10);
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Use Uppercase')
            .setDesc('Include uppercase letters in the random string')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useUppercase)
                    .onChange(async (value) => {
                        this.plugin.settings.useUppercase = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Use Lowercase')
            .setDesc('Include lowercase letters in the random string')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useLowercase)
                    .onChange(async (value) => {
                        this.plugin.settings.useLowercase = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Use Numbers')
            .setDesc('Include numbers in the random string')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useNumbers)
                    .onChange(async (value) => {
                        this.plugin.settings.useNumbers = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Use Symbols')
            .setDesc('Include symbols in the random string')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useSymbols)
                    .onChange(async (value) => {
                        this.plugin.settings.useSymbols = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}
